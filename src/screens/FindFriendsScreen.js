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
  Pressable,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TopRow from '../component/ButtonBars/topRow';
import {Auth, DataStore, Predicates} from 'aws-amplify';
import {useEffect} from 'react/cjs/react.development';
import {FriendshipUser, User, Friendship} from '../models';
import {TextInput} from 'react-native-gesture-handler';
// @refresh reset
const FindFriendsScreen = props => {
  //const [user, setUser] = useState({});
  const user = props.route.params.user;
  const [friends, setFriends] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [potentialFriends, setPotentialFriends] = useState([]);
  const [query, setQuery] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userHasSearchedYet, setUserHasSearchedYet] = useState(false);

  const getFriendsList = async () => {
    const usersFriendships = await DataStore.query(Friendship, f =>
      f
        .or(f =>
          f
            .friendshipSenderId('eq', user.id)
            .friendshipReceiverId('eq', user.id),
        )
        .requestAccepted('eq', true),
    );

    const receivers = usersFriendships.map(f => f.Receiver);
    const senders = usersFriendships.map(f => f.Sender);
    const friends = receivers.concat(senders).filter(u => u.id != user.id);
    const friendsNoDuplicates = [...new Set(friends)];
    //console.log('friendsNoDuplicates', friendsNoDuplicates.map(i=>i.awsID));
    return setFriends(friendsNoDuplicates);
  };

  const search = async () => {
    setIsLoading(true);
    console.log('query', query);
    var potentialFriendsVar = await DataStore.query(User, u =>
      u.username('contains', query.toLowerCase()),
    );
    console.log('potentialfriendsvar', potentialFriendsVar)
    console.log('results:', potentialFriendsVar.map(i=>i.awsID));



    if (friends != null) {
      friendsids = friends.map(p => p.awsID)
    } else {
      friendsids = []
    }
    //console.log('friends ids', friendsids);
    //console.log('friends we filtered',potentialFriendsVar.filter(u=>!friendsids.includes(u.awsID) && u.username != user.username && u.requestAccepted == true));

    setUserHasSearchedYet(true);
    if (potentialFriendsVar.length > 0) {
      console.log("hit")
      setIsLoading(false);
      setQuery('');
      //console.log('heres what were passing to filter:', potentialFriendsVar.map(i=>i.awsID));

      //potentialFriendsVar.forEach(u=>{
        //console.log(!friendsids.includes(u.awsID) && u.username != user.username)
        //console.log(u.username != user.username)
        //console.log(!friendsids.includes(u.awsID))
        //&& u.username != user.username && u.requestAccepted == true
      //})


      //console.log('and results',potentialFriendsVar.filter(u => !friendsids.includes(u.awsID) && u.username != user.username));

      return setPotentialFriends(
        potentialFriendsVar.filter(
          u => !friendsids.includes(u.awsID) && u.username != user.username
        ),
      );
    } else {
      setIsLoading(false);
      setQuery('');
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
        friendshipSenderId: user.id,
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
    let mounted = true;

    if (mounted) {
      getfriendRequests();
    } else {
      console.log('mounting issue');
    }

    return () => (mounted = false);
  }, [friendRequests]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setIsLoading(false);
      setPotentialFriends([]);
      getfriendRequests();
      getFriendsList();
    } else {
      console.log('mounting issue');
    }

    return () => (mounted = false);
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
          <View style={styles.friendRequestContainer}>
            <Text style={styles.friendRequestTitle}>New Friend Requests!</Text>
            <FlatList
              data={friendRequests}
              keyExtractor={(item, index) => {
                return item.id;
              }}
              renderItem={({item}) => (
                <View style={styles.friendRequest}>
                  <View style={styles.userPicContainer}>
                    <Image
                      style={styles.userPic}
                      source={{
                        uri: 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png',
                      }}
                    />
                  </View>
                  <View style={styles.friendRequestUsernameContainer}>
                    <Text style={styles.friendRequestUsername}>
                      {item.Sender.username}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => acceptFriendRequest(item)}
                    style={styles.acceptButtonContainer}>
                    <AntDesign
                      size={40}
                      name="adduser"
                      style={styles.acceptButton}></AntDesign>
                  </Pressable>
                </View>
              )}
            />
          </View>
        ) : (
          <></>
        )}

        <View style={styles.queryArea}>
          <TextInput
            onChangeText={newQuery => {
              setQuery(newQuery), setPotentialFriends([]);
            }}
            style={styles.textInput}
          />
          <Pressable
            onPress={() => search(query)}
            disabled={!query}
            style={styles.searchButton}>
            <Text>Search</Text>
          </Pressable>
        </View>





        {userHasSearchedYet && potentialFriends.length > 0 ? (
          <View  style={styles.find}>
            <FlatList
              data={potentialFriends}
              keyExtractor={(item, index) => {
                return item.id;
              }}
              renderItem={({item}) => (
                <View style={styles.listItem}>
                  <Image style={styles.userPic} source={{uri: 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png'}} />
                  <View style={styles.usernameContainer}>
                    <Text style={styles.title}>{item.username}</Text>
                  </View>
                  
                  <View>
          
                  <Pressable
                    onPress={() => sendFriendRequest(item)}
                    style={styles.acceptButtonContainer}>
                    <AntDesign
                      size={40}
                      name="adduser"
                      style={styles.acceptButton}></AntDesign>
                  </Pressable>

                  </View>
                </View>
              )}
            />
          </View>
        ) 
        
        
        
        : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResults}>No results</Text>
          </View>
        )}
        
        <TopRow screen="FRIENDS"></TopRow>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
  },
  friendRequestContainer: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  friendRequestTitle: {
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
  friendRequest: {
    flex: 4,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#Ead907',
    borderRadius: 5,
    margin: 10,
  },
  userPicContainer: {
    flex: 2,
    justifyContent: 'center',
    margin: 5,
  },
  userPic: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  friendRequestUsernameContainer: {
    fontSize: 20,
    flex: 2,
    alignContent: 'center',
    justifyContent: 'center',
  },
  friendRequestUsername: {
    fontSize: 20,
  },
  acceptButtonContainer: {
    flex: 1,
    backgroundColor: '#Eeff00',
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  acceptButton: {},
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  queryArea: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  textInput: {
    height: 25,
    width: '90%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    margin: 10,
  },

  searchButton: {
    backgroundColor: '#D6173c',
    height: 40,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
    padding: 5,
  },
  find: {
    flex: 3,
    flexDirection: "column",
  },
  noResultsContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    fontSize: 20,

  },
  listItem: {
    width: '100%',
    borderColor: 'black',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    margin: 10,
    padding:5
  },
  title:{
    fontSize: 20,
    textAlign: 'left'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default FindFriendsScreen;
