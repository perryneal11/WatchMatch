import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  Button,
} from 'react-native';
import TopRow from '../component/ButtonBars/topRow';
import {Auth, DataStore, Predicates} from 'aws-amplify';
import {useEffect} from 'react/cjs/react.development';
import {Friendship, FriendshipUser, User} from '../models';
import { useNavigation } from '@react-navigation/native';

const MatchesScreen = () => {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const navigation = useNavigation();

  const getCurrentUser = async () => {
    const userVar = await Auth.currentAuthenticatedUser();
    const dbUsers = await DataStore.query(User, u =>
      u.awsID('eq', userVar.attributes.sub),
    );
    const dbUser = dbUsers[0];
    return setUser(dbUser);
  };

  const viewWatchMatches = item => {
    //console.log('yay', item);
    navigation.navigate('WatchMatches', {friend: item, user: user}  )

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

  useEffect(() => {
    getFriendsList();
  }, [user]);

  useEffect(() => {
    getCurrentUser();
    //getFriendsList();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Text>Youre Friends</Text>

      {friends? (<FlatList
        data={friends}
        keyExtractor={(item, index) => {
          return item.id;
        }} 
        renderItem={({item}) => (
          <View style={styles.listItem}>
            <Image />
            <View style={styles.metaInfo}>
              <Text style={styles.title}>
                {item.username}
              </Text>
            </View>
            <View>
              <Button
                title="View Watch Matches"
                onPress={() => viewWatchMatches(item)}></Button>
            </View>
          </View>
        )}
      />):(<Text>No friends</Text>)}

      
      <TopRow screen="MATCHES"></TopRow>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  users: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  listItem: {
    borderColor: 'black',
    borderWidth: 3,
    margin: 3,
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
});

export default MatchesScreen;
