import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, useWindowDimensions, Image, ActivityIndicator} from 'react-native';
import Card from '../component/ShowCard/';
import AnimatedStack from '../component/AnimatedStack/';
import {Auth, DataStore} from 'aws-amplify'
import TopRow from '../component/ButtonBars/topRow';
import {User} from '../models'

const HomeScreen = () => {

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
    },
    {title: "movie3",
    backdropPath: "/3uwyXMZN93PRkShUxvLrufwVAc2.jpg",
    overview: "This is an overview",
    imdbID: 'tt9850360'
    }
  ]
  const [movieData, setMovieData] = React.useState(testData)
  const [filteredData, setFilteredData] = React.useState(movieData)
  const [currentMovie, setCurrentMovie] = React.useState()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = React.useState({})



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
    const userVar = await Auth.currentAuthenticatedUser()
    console.log("user in get current user" , userVar.attributes)
    const dbUsers = await DataStore.query(User, u => u.awsID("eq", userVar.attributes.sub))
    console.log("dbusers", dbUsers)
    const dbUser = dbUsers[0];
    console.log("dbuser", dbUser)
    return setUser(dbUser)
    }

  const filterMovieData = async () => {
    if (user){
      console.log("user", user)
    const likedMovies = user.approvedContentIMDBID
    console.log("liked movies ", likedMovies)
    const dislikedMovies = user.unapprovedContentIMDBID
    console.log("disliked movies ", dislikedMovies)
    if(likedMovies != null || dislikedMovies != null){
      console.log("if a  ")
      console.log("filtered ", movieData.filter(item => !likedMovies.includes(item.imdbID) && !dislikedMovies.includes(item.imdbID)))
      return setMovieData(movieData.filter(item => !likedMovies.includes(item.imdbID) && !dislikedMovies.includes(item.imdbID)))
    }
    else return 
  }
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
    setIsLoading(true)
    //fetchData()
    getCurrentUser()
    filterMovieData(movieData)
    setIsLoading(false)
  },)
  

  return (
    <View style={styles.pageContainer}>
         {isLoading? 
         (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#5500dc" />
          </View>
        ) : <Text></Text>}

      {movieData.length > 0 ? (
            <AnimatedStack
              data={movieData}
              renderItem = {({item}) => <Card movie={item}image={item.backdropPath} />}
              onSwipeLeft = {onSwipeLeft}
              onSwipeRight = {onSwipeRight}
              setCurrentMovie = {setCurrentMovie}>
            </AnimatedStack>) : (<Text stlye = {styles.error}>No Movie Data</Text>)}
            <TopRow screen = 'HOME'></TopRow>
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
  error: {
    flex: 6,
    backgroundColor: 'white',
    width: 100,
    height: 100,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
  
  }
});

export default HomeScreen;
