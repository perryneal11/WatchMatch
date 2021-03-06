import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TopRow from '../component/ButtonBars/topRow';
import {DataStore} from 'aws-amplify';
import {useEffect} from 'react/cjs/react.development';
import {Friendship, FriendshipUser, User} from '../models';
import {useNavigation} from '@react-navigation/native';

const MatchesScreen = props => {
  const user = props.route.params.user;
  const [friends, setFriends] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const avatar =
    'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png';

  const viewWatchMatches = item => {
    navigation.navigate('WatchMatches', {friend: item, user: user});
  };

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
    setIsLoading(false);
    return setFriends(friendsNoDuplicates);
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setIsLoading(false);
      getFriendsList();
    } else {
    }
    return () => (mounted = false);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});
    return unsubscribe;
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.root}>
        {friends != null ? (
          <FlatList
            data={friends}
            style={styles.flatList}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            renderItem={({item}) => (
              <View style={styles.listItem}>
                <View style={styles.userPicContainer}>
                  <Image
                    style={styles.userPic}
                    source={{
                      uri: 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png',
                    }}
                  />
                </View>
                <View style={styles.usernameContainer}>
                  <Text style={styles.username}>{item.username}</Text>
                </View>

                <Pressable
                  onPress={() => viewWatchMatches(item)}
                  style={styles.playButtonContainer}>
                  <AntDesign
                    name="play"
                    style={styles.playButton}
                    size={40}></AntDesign>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <View style={styles.noFriendsContainer}>
            <Text style={styles.noFriends}>No friends</Text>
          </View>
        )}

        <TopRow screen="MATCHES"></TopRow>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
  },
  flatList: {
    flex: 6,
  },
  listItem: {
    flex: 7,
    borderTopColor: 'grey',
    borderBottomColor: 'grey',
    borderTopWidth: 0.01,
    borderBottomWidth: 1,
    margin: 3,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
  },
  userPicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPic: {
    flex: 1,
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  playButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    flex: 1,
    color: 'green',
  },
  usernameContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 10,
  },
  username: {
    fontSize: 20,
  },
  noFriendsContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFriends: {
    fontSize: 20,
  },
});

export default MatchesScreen;
