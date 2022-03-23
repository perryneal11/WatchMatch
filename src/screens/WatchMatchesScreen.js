import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import AnimatedStack from '../component/AnimatedStack/';
import Card from '../component/ShowCard/';
import TopRow from '../component/ButtonBars/topRow';


const WatchMatchesScreen = ({route, navigation}) => {
  const friend = route.params;
  const [shows, setShows] = useState([]);
  const [currentMovie, setCurrentMovie] = React.useState();

  const getShowsInCommon = () => {
    const combinedShows = [];
    const usersShows = [];
    const friendsShows = [];
    if (friend.friend.approvedContentIMDBID != null && route.params.user.approvedContentIMDBID != null) {
      friend.friend.approvedContentIMDBID.forEach(o => {
        //console.log("friend", o)
        friendsShows.push(JSON.parse(o));
        combinedShows.push(JSON.parse(o));
      });
  
      route.params.user.approvedContentIMDBID.forEach(o => {
        //console.log("user", o)
        usersShows.push(JSON.parse(o));
        combinedShows.push(JSON.parse(o));
      });


    }


    //console.log("combined shows", combinedShows)

    const usersShowsImdbids = usersShows.map(s => s.imdbID);
    const friendsShowsImdbids = friendsShows.map(s => s.imdbID);
    const combinedShowsImdbids = combinedShows.map(s => s.imdbID);
    //console.log("combinedShowsImdbids",combinedShowsImdbids)
    //console.log("usersShowsImdbids",usersShowsImdbids)
    //console.log("friendsShowsImdbids",friendsShowsImdbids)

    const combined = combinedShows.filter(
      s =>
        friendsShowsImdbids.includes(s.imdbID) &&
        usersShowsImdbids.includes(s.imdbID),
    );

    //console.log("combined", combined, typeof combined)

    if (
      friendsShows != null ||
      (friendsShows.length != 0 && usersShows != null) ||
      usersShows.length != 0
    ) {
      const showsNoDuplicates = Array.from(new Set(combined.flat()));
      //console.log('showsNoDuplicates', showsNoDuplicates, typeof showsNoDuplicates);

      //showsNoDuplicates.forEach(item=>{
      //  console.log(item, item != null)
      //  console.log(item, item.length != 0)
      //})

      var showsNoDuplicatesNoEmpties = showsNoDuplicates.filter(
        el => el != null && el.length != 0,
      );
      //console.log('showsNoDuplicatesNoEmpties', showsNoDuplicatesNoEmpties, typeof showsNoDuplicatesNoEmpties);
      return setShows(showsNoDuplicates);
    } else return;
  };

  const onSwipeLeft = currentMovie => {
    //console.log("left")
  };

  const onSwipeRight = currentMovie => {
    //console.log("right", shows)
  };

  useEffect(() => {
    getShowsInCommon();
  }, []);

  return (
    <SafeAreaView style={styles.pageContainer}>
      
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Shows for you and {friend.friend.username}{' '}
        </Text>
      </View>
      
      <View style={styles.showsContainer}>
      {shows.length > 0 ? (

          <AnimatedStack
            data={shows}
            renderItem={({item}) => <Card movie={item} />}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
            setCurrentMovie={setCurrentMovie}
            resetFlag={true}></AnimatedStack>

      ) : (
        <Text>No shows you both like</Text>
      )}
              </View>
              <TopRow screen="MATCHES" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 6,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header:{
    fontSize: 20
  },
  showsContainer: {
    width: '100%',
    height: '100%',
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default WatchMatchesScreen;
