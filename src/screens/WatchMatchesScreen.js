import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Text, SafeAreaView, FlatList, Image} from 'react-native';
import AnimatedStack from '../component/AnimatedStack/';
import Card from '../component/ShowCard/';

const WatchMatchesScreen = ({route, navigation}) => {
  const friend = route.params;
  const [shows, setShows] = useState([])
  const [currentMovie, setCurrentMovie] = React.useState();

  const getShowsInCommon = () => {
    const combinedShows = []
    const usersShows = []
    const friendsShows = []

    friend.friend.approvedContentIMDBID.forEach(o => {
        //console.log("friend", o)
        friendsShows.push(JSON.parse(o))
        combinedShows.push(JSON.parse(o))
      })

    route.params.user.approvedContentIMDBID.forEach(o => {
        //console.log("user", o)
        usersShows.push(JSON.parse(o))
        combinedShows.push(JSON.parse(o))
      })

    //console.log("combined shows", combinedShows)

    const usersShowsImdbids = usersShows.map(s=>s.imdbID)   
    const friendsShowsImdbids = friendsShows.map(s=>s.imdbID)  
    const combinedShowsImdbids = combinedShows.map(s=>s.imdbID)
    console.log("combinedShowsImdbids",combinedShowsImdbids)
    console.log("usersShowsImdbids",usersShowsImdbids)
    console.log("friendsShowsImdbids",friendsShowsImdbids)

      const combined = combinedShows.filter(
        s => friendsShowsImdbids.includes(s.imdbID) && usersShowsImdbids.includes(s.imdbID)
      )

    console.log("combined", combined, typeof combined)


    if (friendsShows != null || friendsShows.length != 0 && usersShows != null || usersShows.length != 0) {
      const showsNoDuplicates = Array.from(new Set(combined));
      console.log('showsNoDuplicates', showsNoDuplicates, typeof showsNoDuplicates);
      return setShows(showsNoDuplicates)
    }
    else return 
  };

  const onSwipeLeft = currentMovie => {
    console.log("left")

  };

  const onSwipeRight = currentMovie => {
    console.log("right", shows)
    setShows(shows)
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
          setCurrentMovie={setCurrentMovie}
          resetFlag={true}>
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
