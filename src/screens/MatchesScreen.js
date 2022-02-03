import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  Button,
  ActivityIndicator,
} from 'react-native';
import TopRow from '../component/ButtonBars/topRow';
import {Auth, DataStore, Predicates} from 'aws-amplify';
import {useEffect} from 'react/cjs/react.development';
import {Friendship, FriendshipUser, User} from '../models';
import { useNavigation } from '@react-navigation/native';

const MatchesScreen = props => {
  //const [user, setUser] = useState({});
  const user = props.route.params.user
  const [friends, setFriends] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

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
    setIsLoading(false);
    return setFriends(friendsNoDuplicates);

  };

  useEffect(() => {
    let mounted = true 
    if (mounted) {
      setIsLoading(true);
      getFriendsList();
      console.log("hw;eoifhweoifh", (friends != null))
    } 
    else {
      console.log("mounting issue")
    }
    return () => mounted = false
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.root}>
        <Text>Welcome {user.username}!</Text>
        {friends != null ?
         (
         <FlatList
          data={friends}
          style = {{backgroundColor: "orange"}}
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
        />):(
        <View style = {styles.noFriends}>
          <Text>No friends</Text>
          <Text>No friends</Text>
          <Text>No friends</Text>
          <Text>No friends</Text>
          <Text>No friends</Text>
          <Text>No friends</Text>
          <Text>No friends</Text>
          <Text>No friends</Text>
        </View>)}

      <TopRow screen="MATCHES"></TopRow>
    </SafeAreaView>
  );}
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
    backgroundColor: 'green',
  },
  listItem: {
    borderColor: 'black',
    backgroundColor: 'green',
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
  noFriends: {
    width: "100%",
    hegiht: "100%",
    backgroundColor: 'blue'
  }
});

export default MatchesScreen;
