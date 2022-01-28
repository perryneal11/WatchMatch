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
    const friendsList = user.friends;
    const friendsFromDb = await DataStore.query(
      User,
      u => u.awsID in friendsList,
    );
    return setFriends(friendsFromDb);
  };

  const search = async () => {
    setIsLoading(true);
    console.log('query', query);
    const potentialFriendsVar = await DataStore.query(
      User,
      u => u.username('contains', query.toLowerCase()),
      {
        page: 1,
        limit: 10,
      },
    );
    console.log(potentialFriendsVar);

    if (potentialFriendsVar.length > 0) {
      setIsLoading(false);
      return setPotentialFriends(potentialFriendsVar);
    } else {
      setIsLoading(false);
      return;
    }
    //TODO: filter out already friends
  };

  const sendFriendRequest = async receiver => {
    // first you save the friendship for the current user
    const friendship = await DataStore.save(
      new Friendship({
        requestAccepted: false,
      }),
      setPotentialFriends([]),
    );

    // then you save the link to friendship for current user
    await DataStore.save(
      new FriendshipUser({
        user: user,
        friendship: friendship,
      }),
    );

    //and finally, the reciever
    await DataStore.save(
      new FriendshipUser({
        user: receiver,
        friendship: friendship,
      }),
    );

    Alert.alert('Friend Request Sent');

    //TODO: Make add button disabled for this user
  };

  const acceptFriendRequest = async id => {
    const friendshipByFriendshipUserLinkId = (
      await DataStore.query(FriendshipUser)
    )
      .filter(fu => fu.id === id)
      .map(f => f.friendship);

    console.log(
      'friendshipByFriendshipUserLinkId',
      friendshipByFriendshipUserLinkId[0],
    );

    await DataStore.save(
      Friendship.copyOf(friendshipByFriendshipUserLinkId[0], updated => {
        updated.requestAccepted = true;
      }),
    );
  };

  const getfriendRequests = async () => {
    //first we get the un accepted friend requests.
    const usersFriendships = (await DataStore.query(FriendshipUser))
      .filter(fu => fu.user.id == user.id)
      .map(fu => fu.friendship)
      .filter(f => !f.requestAccepted)
      .map(f => f.id);
    //console.log("users friendships", usersFriendships)
    const usersLinkedToSameFriendship = (
      await DataStore.query(FriendshipUser)
    ).filter(
      fu =>
        usersFriendships.includes(fu.friendship.id) &&
        fu.user.username != user.username,
    );
    //console.log("users with same friendships",usersLinkedToSameFriendship )
    return setFriendRequests(usersLinkedToSameFriendship);
  };

  useEffect(() => {
    getfriendRequests();
  }, [friendRequests]);

  useEffect(() => {
    setIsLoading(false);
    getCurrentUser();
    setPotentialFriends([]);
    getfriendRequests();
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
                  <Text style={styles.title}>{item.user.username}</Text>
                  <View>
                    <Button
                      title="Accept"
                      onPress={() => acceptFriendRequest(item.id)}></Button>
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
          style={{backgroundColor: '#fff', paddingHorizontal: 20}}></TextInput>
        <Button title="Search" onPress={() => search(query)}></Button>

        {!userHasSearchedYet && potentialFriends.length == 0 ? (
          <Text>Find your friends</Text>
        ) : (
          <Text></Text>
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
