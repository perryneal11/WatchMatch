import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Text, SafeAreaView, FlatList, Image} from 'react-native';
import AnimatedStack from '../component/AnimatedStack/';
import Card from '../component/ShowCard/';

const WatchMatchesScreen = ({route, navigation}) => {
  const friend = route.params;
  const [shows, setShows] = useState([])
  const [currentMovie, setCurrentMovie] = React.useState();

  const getShowsInCommon = () => {
    const friendsShows = friend.friend.approvedContentIMDBID;
    console.log('friends shows', friendsShows);
    const usersShows = route.params.user.approvedContentIMDBID;
    console.log('your shows', friendsShows);
    if (friendsShows != null && usersShows != null) {
      const combined = usersShows.concat(friendsShows);
    console.log('combined', combined);


    combined.forEach(element => {
      console.log('a', usersShows.includes(element));
    });

    const showsNoDuplicates = [...new Set(combined)];
    console.log('showsNoDuplicates', showsNoDuplicates);
    const showsYouBothLike = showsNoDuplicates.filter(
      s => friendsShows.includes(s) && usersShows.includes(s),
    );

 
    return setShows(showsNoDuplicates)
    }
    else return 
  };

  const onSwipeLeft = currentMovie => {
    console.log("left")
  };

  const onSwipeRight = currentMovie => {
    console.log("right")
  };

  useEffect(() => {
    getShowsInCommon();
  },[]);
 
  return (
    <SafeAreaView style={styles.pageContainer}>
    <Text style = {styles.header}>Shows for you and {friend.friend.username} </Text>
      {shows? (
      <View style = {styles.root}>
          <AnimatedStack
            data={shows}
            renderItem={({item}) => (
              <Card movie={item} image={item.backdropPath} />
            )}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          setCurrentMovie={setCurrentMovie}>
          </AnimatedStack>
      </View>
      ):(<Text>No shows you both like</Text>)}
    </SafeAreaView>)
};

const styles = StyleSheet.create({
    pageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3,
        backgroundColor: '#ededed',
      },
      root: {
        width: '100%',
        height: '100%',
        flex: 1
      },
    shows: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        flex: 3
       
    },
    image:{
        width: '100%',
        height: '100%',
        flex: 1

        
    },
    header:{
        width: '100%',
        height: '100%',
        flex: 1
        
    },
    show: {
        width: '100%',
        height: '100%',
        borderColor: 'black',
        borderWidth: 3,
        margin: 3,
    },


})

export default WatchMatchesScreen;
