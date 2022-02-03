import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Button,
  Image,
  Alert,
  Pressable
} from 'react-native';
import TopRow from '../component/ButtonBars/topRow';
import {Auth, DataStore, Predicates} from 'aws-amplify';
import {useEffect} from 'react/cjs/react.development';
import {FriendshipUser, User, Friendship} from '../models';
import {TextInput} from 'react-native-gesture-handler';

const FindFriendsScreen = () => {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [potentialFriends, setPotentialFriends] = useState([]);
  const [query, setQuery] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userHasSearchedYet, setUserHasSearchedYet] = useState(false);

  const getCurrentUser = async () => {
    const userVar = await Auth.currentAuthenticatedUser();
    const dbUsers = await DataStore.query(User, u =>
      u.awsID('eq', userVar.attributes.sub),
    );
    const dbUser = dbUsers[0];
    return setUser(dbUser);
  };


  const getFriendsList = async () => {
    const usersFriendships = await DataStore.query(Friendship, f =>
      f.or(f =>
        f.friendshipSenderId('eq', user.id).friendshipReceiverId('eq', user.id),
      ).requestAccepted('eq', true),
    );

    const receivers = usersFriendships.map(f => f.Receiver );
    const senders = usersFriendships.map(f => f.Sender);
    console.log("rec",usersFriendships)
    const friends = receivers.concat(senders).filter(u => u.id != user.id);
    const friendsNoDuplicates = [...new Set(friends)];
    console.log('wtf', friendsNoDuplicates);
    return setFriends(friendsNoDuplicates);
  };

  const search = async () => {
    setIsLoading(true);
    //console.log('query', query);
    var potentialFriendsVar = await DataStore.query(
      User,
      u => u.username('contains', query.toLowerCase()),
      {
        page: 1,
        limit: 10,
      },
    )
    
    //console.log("friends we filtrin", potentialFriendsVar.filter(u => !friends.includes(u.awsID)));
    setUserHasSearchedYet(true)
    if (potentialFriendsVar.length > 0) {
      setIsLoading(false);
      setQuery("")
      return setPotentialFriends(potentialFriendsVar.filter(u => friends.includes(u.awsID)));
    } else {
      setIsLoading(false);
      setQuery("")
      return;
    }
  };

  const sendFriendRequest = async receiver => {
    // first you save the friendship for the current user
    const friendship = await DataStore.save(
      new Friendship({
        requestAccepted: false,
        Sender: user,
        Recevier: receiver,
        friendshipReceiverId: receiver.id,
        friendshipSenderId: user.id
      }),
      setPotentialFriends([]),
    );

    Alert.alert('Friend Request Sent');

    //TODO: Make add button disabled for this user
  };
  
  const acceptFriendRequest = async friendRequest => {

    //console.log(friendRequest);
    await DataStore.save(
      Friendship.copyOf(friendRequest, updated => {
        updated.requestAccepted = true;
      }),
    );
    Alert.alert('Friend Request Accepted');
  };

  const getfriendRequests = async () => {
    const friendRequests = await DataStore.query(Friendship, f =>
      f.friendshipReceiverId('eq', user.id).requestAccepted('eq', false),
    );
    //console.log('friend requests', friendRequests);
    return setFriendRequests(friendRequests);
  };

  useEffect(() => {
    getfriendRequests();
  }, [friendRequests]);

  useEffect(() => {
    setIsLoading(false);
    getCurrentUser();
    setPotentialFriends([]);
    getfriendRequests();
    getFriendsList();
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18}}>
          Error fetching data... Check your network connection!
        </Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.root}>
        {friendRequests.length > 0 ? (
          <>
            <Text>Friend Requests</Text>
            <FlatList
              data={friendRequests}
              keyExtractor={(item, index) => {
                return item.id;
              }}
              renderItem={({item}) => (
                <View style={styles.friendRequests}>
                  <Text style={styles.title}>{item.Sender.username}</Text>
                  <View>
                    <Button
                      title="Accept"
                      onPress={() => acceptFriendRequest(item)}></Button>
                  </View>
                </View>
              )}
            />
          </>
        ) : (
          <></>
        )}

        <Text>Find Friends</Text>

        <TextInput
          onChangeText={newQuery => {
            setQuery(newQuery), setPotentialFriends([]);
          }}
          style={{backgroundColor: '#fff', paddingHorizontal: 20}}/>
        <Pressable 
        onPress={() => search(query)}
        disabled={!query}
        style={styles.button}>
          <Text>Search</Text>
        </Pressable>

        {!userHasSearchedYet && potentialFriends.length == 0 ? (
          <Text></Text>
        ) : (

            <Text style={styles.find}> No results</Text>

          
        )}
        {potentialFriends ? (
          <FlatList
            data={potentialFriends}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <Image />
                <View style={styles.metaInfo}>
                  <Text style={styles.title}>{item.username}</Text>
                </View>
                <View>
                  <Button
                    title="Add"
                    style={styles.button}
                    onPress={() => sendFriendRequest(item)}></Button>
                </View>
              </View>
            )}
          />
        ) : (
          <Text>No Users Found</Text>
        )}

        <TopRow screen="FRIENDS"></TopRow>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 3,
    padding: 10,
  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#D6173c',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10
},
find:{
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  backgroundColor: '#D6173c',
  flex: 1
},
  user: {
    width: 100,
    height: 100,
    margin: 10,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    padding: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  listItem: {
    borderColor: 'black',
    borderWidth: 3,
    margin: 3,
  },
});

export default FindFriendsScreen;
