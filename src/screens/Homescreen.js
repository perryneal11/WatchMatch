import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, useWindowDimensions, Image} from 'react-native';
import Card from '../component/ShowCard/';
import AnimatedStack from '../component/AnimatedStack/';
import {Auth, DataStore} from 'aws-amplify'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopRow from '../component/ButtonBars/topRow';
import {User} from '../models'




const HomeScreen = () => {
  const [movieData, setMovieData] = React.useState()
  const [filteredData, setFilteredData] = React.useState(movieData)
  const [currentMovie, setCurrentMovie] = React.useState()
  const [user, setUser] = React.useState()

  testData = 
[
  {title: "movie",
  backdropPath: "/pYziM5SEmptPW0LdNhWvjzR2zD1.jpg",
  overview: "This is an overview",
  imdbID: 'tt9850370'
  },
  {title: "movie2",
  backdropPath: "/a7f2CN7sBmFJJu5uO9BvDgqOEAc.jpg",
  overview: "This is an overview",
  imdbID: 'tt9850380'
  }
]
  

  const fetchData = async () => {
   fetch("https://streaming-availability.p.rapidapi.com/search/basic?country=us&service=netflix&type=movie&output_language=en&language=en", {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
      "x-rapidapi-key": "db460db4c2msha835e81c42d874ep1c1433jsnb1e93e0e6758"
    }
  })
  .then(response => response.json())
  .then(data => {
    //setMovieData(data.results)

  })
  .catch(err => {
    console.error(err);
  })}


  const getCurrentUser = async ()=> {
    const user = await Auth.currentAuthenticatedUser()
    const dbUsers = await DataStore.query(User, u => u.awsID === user.attributes.sub)
    const dbUser = dbUsers[0];
    setUser(dbUser)
    }

  const filterMovieData = async (movieData) => {
    const likedMovies = user.approvedContentIMDBID
    setFilteredData(movieData.filter(item => !user.approvedContentIMDBID.includes(item.imdbID)))
    setMovieData(filteredData)
  } 

  const save = async (newIMDBID, approved) => { 
    console.log('SAVING' , currentMovie.imdbID)
    const updateUser = User.copyOf(user, updated => {
      if(approved == true){ 
        if(updated.approvedContentIMDBID == null){
          updated.approvedContentIMDBID = [newIMDBID]
        } else {
          updated.approvedContentIMDBID.push(newIMDBID)
        }
      } else {
        if(updated.unapprovedContentIMDBID == null){
          updated.unapprovedContentIMDBID = [newIMDBID]
        } else {
          updated.unapprovedContentIMDBID.push(newIMDBID)
        }
      }
    })
    await DataStore.save(updateUser)
  }

  const onSwipeLeft = (currentMovie) => {
      save(currentMovie.imdbID, true)
  } 

  const onSwipeRight = (currentMovie) => {
    save(currentMovie.imdbID, false)
  } 

  useEffect(()=>{
    //fetchData()
    getCurrentUser()
    console.log('user', user)
    setMovieData(testData)
    console.log('movieData', movieData)
    filterMovieData(movieData)
  }, [])
  

  return (
    <View style={styles.pageContainer}>
      <TopRow></TopRow>
      {movieData ? (
            <AnimatedStack
              data={movieData}
              renderItem = {({item}) => <Card movie={item}image={item.backdropPath} />}
              onSwipeLeft = {onSwipeLeft}
              onSwipeRight = {onSwipeRight}
              setCurrentMovie = {setCurrentMovie}>
            </AnimatedStack>) : (<Text>No Movie Data</Text>)}

    
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: "#ededed"
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    width: '100%'
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  }
});

export default HomeScreen;
