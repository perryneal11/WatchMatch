import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Text, SafeAreaView, FlatList, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DataStore} from 'aws-amplify';

const WatchMatchesScreen = ({route, navigation}) => {
  const friend = route.params;
  const [shows, setShows] = useState([])

  const getMovieInfo = async () => {
    //let imdbID = "tt0848228"
    fetch("https://streaming-availability.p.rapidapi.com/get/basic?country=us&imdb_id=" + imdbID.toString() + "&output_language=en", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
            "x-rapidapi-key": "db460db4c2msha835e81c42d874ep1c1433jsnb1e93e0e6758"
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data)
        //setMovieData(data.results)
      })
    .catch(err => {
        //console.error(err);
    });
    
  }

  const getShowsInCommon = () => {
    const friendsShows = friend.friend.approvedContentIMDBID;
    //console.log('friends shows', friendsShows);
    const usersShows = route.params.user.approvedContentIMDBID;
    //console.log('your shows', friendsShows);
    const combined = usersShows.concat(friendsShows);
    //console.log('scombined', combined);
    const showsYouBothLike = combined.filter(
      s => friendsShows.includes(s) && usersShows.includes(s),
    );
    //console.log('showsYouBothLike', showsYouBothLike);
    const showsNoDuplicates = [...new Set(showsYouBothLike)];
    //console.log('showsNoDuplicates', showsNoDuplicates);
    return setShows(showsNoDuplicates)
  };

  useEffect(() => {
    getShowsInCommon();
    getMovieInfo()
  }, []);

  {
    //console.log('wha', friend.friend);
  }
  return (
    <SafeAreaView style={styles.pageContainer}>
        
      <Text style = {styles.header}>Shows for you and {friend.friend.username} </Text>
      {shows?
      (<FlatList
        data={shows}
        style = {styles.shows}
        keyExtractor={(item, index) => {
          return item.id;
        }} 
        renderItem={({item}) => (
          <View style = {styles.show}>
            <Image source = {{uri: "https://image.tmdb.org/t/p/w300//nNmJRkg8wWnRmzQDe2FwKbPIsJV.jpg"}} style = {styles.image}/>
            <View>
              <Text>show {item}</Text>
            </View>
          </View>
        )}
      />
      ):(<Text>No shows you both like</Text>)}
    
  </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    pageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3,
        backgroundColor: '#ededed',
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
