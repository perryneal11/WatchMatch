import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import Card from '../component/ShowCard/';
import AnimatedStack from '../component/AnimatedStack/';
import {Auth, DataStore} from 'aws-amplify';
import TopRow from '../component/ButtonBars/topRow';
import {User} from '../models';
import {SafeAreaView} from 'react-native-safe-area-context';

const HomeScreen = props => {
  testData = [
    {
      title: 'movie',
      backdropPath: '/pYziM5SEmptPW0LdNhWvjzR2zD1.jpg',
      overview: 'This is an overview',
      imdbID: 'tt9850370',
    },
    {
      title: 'movie2',
      backdropPath: '/a7f2CN7sBmFJJu5uO9BvDgqOEAc.jpg',
      overview: 'This is an overview',
      imdbID: 'tt9850380',
    },
    {
      title: 'movie3',
      backdropPath: '/3uwyXMZN93PRkShUxvLrufwVAc2.jpg',
      overview: 'This is an overview',
      imdbID: 'tt9850360',
    },
    {
      title: 'movie4',
      backdropPath: '/4EXqDG8MZOeDO01N18HEZZRTUvk.jpg',
      overview: 'This is an overview',
      imdbID: 'tt9850400',
    },
    {
      title: 'movie5',
      backdropPath: '/6CyILXa0BOm6HtV4naOjg5B2RRZ.jpg',
      overview: 'This is an overview',
      imdbID: 'tt9850410',
    },
    {
      title: 'movie6',
      backdropPath: '/5eZ8kRSlD8P8a42y9GEGl1yAqOb.jpg',
      overview: 'This is an overview',
      imdbID: 'tt9850420',
    },
    {
      title: 'movie7',
      backdropPath: '/rKzHtW1bdboA89FwiyRBNTY7edc.jpg',
      overview: 'This is an overview',
      imdbID: 'tt9850430',
    },
    
  ];
  const [movieData, setMovieData] = React.useState(testData);
  const [filteredData, setFilteredData] = React.useState([]);
  const [currentMovie, setCurrentMovie] = React.useState();
  const [isLoading, setIsLoading] = useState(false);
  const user = props.route.params.user

  const fetchData = async () => {
    fetch(
      'https://streaming-availability.p.rapidapi.com/search/basic?country=us&service=netflix&type=movie&output_language=en&language=en',
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
          'x-rapidapi-key':
            'db460db4c2msha835e81c42d874ep1c1433jsnb1e93e0e6758',
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        //setMovieData(data.results)
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getCurrentUser = async () => {
    const userVar = await Auth.currentAuthenticatedUser();
    //console.log('user in get current user', userVar.attributes);
    const dbUsers = await DataStore.query(User, u =>
      u.awsID('eq', userVar.attributes.sub),
    );
    //console.log('dbusers', dbUsers);
    const dbUser = dbUsers[0];
    //console.log('dbuser', dbUser);
    return setUser(dbUser);
  };


  

  const filterMovieData = () => {
    if (user) {
      //console.log('user', user);
      const likedMovies = []
      user.approvedContentIMDBID.forEach(o => {
        //console.log("object", o)
        likedMovies.push(JSON.parse(o))
      })
      const likedMoviesimdbids = likedMovies.map(m=>m.imdbID)
      //console.log("likedMoviesimdbids", likedMoviesimdbids)

      const dislikedMovies = []
      user.unapprovedContentIMDBID.forEach(o => {
        //console.log("object", o)
        dislikedMovies.push(JSON.parse(o))
      })
      const dislikedMoviesimdbids = dislikedMovies.map(m=>m.imdbID)
      //console.log("dislikedMoviesimdbids", dislikedMoviesimdbids)

      if (likedMovies != null && dislikedMovies != null) {
        //console.log('filtered ',movieData.filter(item =>!likedMoviesimdbids.includes(item.imdbID) &&!dislikedMoviesimdbids.includes(item.imdbID),),);
        return setFilteredData(
          movieData.filter(
            item =>
              !likedMoviesimdbids.includes(item.imdbID) &&
              !dislikedMoviesimdbids.includes(item.imdbID),
          ),
        );
      } else 
      //console.log('b');
      return setFilteredData(movieData);
    }
  };

  const save = async (newIMDBID, approved) => {
    //console.log('SAVING', currentMovie.imdbID);
    const updateUser = User.copyOf(user, updated => {
      if (approved == true) {
        if (updated.approvedContentIMDBID == null) {
          updated.approvedContentIMDBID = newIMDBID;
        } else {
          updated.approvedContentIMDBID = newIMDBID;
        }
      } else {
        if (updated.unapprovedContentIMDBID == null) {
          updated.unapprovedContentIMDBID = newIMDBID;
        } else {
          updated.unapprovedContentIMDBID = newIMDBID;
        }
      }
    });
    await DataStore.save(updateUser);
  };

  const onSwipeLeft = currentMovie => {
    save(currentMovie, false);
  };

  const onSwipeRight = currentMovie => {
    save(currentMovie, true);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [filteredData]);

  useEffect(() => {
    filterMovieData(movieData);
  }, [movieData]);

  useEffect(() => {
    setIsLoading(true);
    //console.log("user from home", props.route.params.user.username)
    //fetchData()
    //getCurrentUser();
    filterMovieData(movieData);
  }, []);
  return (
    <SafeAreaView style={styles.pageContainer}>
                  {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#5500dc" />
        </View>
      ) : (
        <View style = {styles.animatedStack}>
          {!filteredData.length == 0 ? (
            <AnimatedStack
              data={filteredData}
              renderItem={({item}) => (
                <Card movie={item}  />
              )}
              onSwipeLeft={onSwipeLeft}
              onSwipeRight={onSwipeRight}
              setCurrentMovie={setCurrentMovie}></AnimatedStack>
          ) : (
            <Text stlye={styles.error}>No Movie Data</Text>
          )}
        </View>
      )}

      <TopRow screen="HOME"></TopRow>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ededed',
  },
  animatedStack: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ededed',
    width: '100%',
    height: '100%'
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
  },
});

export default HomeScreen;
