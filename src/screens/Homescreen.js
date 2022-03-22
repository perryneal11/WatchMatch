import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import Card from '../component/ShowCard/';
import AnimatedStack from '../component/AnimatedStack/';
import {Auth, DataStore} from 'aws-amplify';
import TopRow from '../component/ButtonBars/topRow';
import {User} from '../models';
import {SafeAreaView} from 'react-native-safe-area-context';

const HomeScreen = props => {
  const [movieData, setMovieData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [currentMovie, setCurrentMovie] = React.useState();
  const [isLoading, setIsLoading] = useState(false);
  const user = props.route.params.user;

  const fetchData = async () => {
    console.log('HITTING');
    fetch('https://radiant-reaches-78484.herokuapp.com/getMovies', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMovieData(data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const filterMovieData = () => {
    if (user) {
      const likedMovies = [];
      if (user.approvedContentIMDBID) {
        user.approvedContentIMDBID.forEach(o => {
          //console.log("object", o)
          likedMovies.push(JSON.parse(o));
        });
      }

      const likedMoviesimdbids = likedMovies.map(m => m.imdbID);
      //console.log("likedMoviesimdbids", likedMoviesimdbids)

      const dislikedMovies = [];

      if (user.unapprovedContentIMDBID) {
        user.unapprovedContentIMDBID.forEach(o => {
          //console.log("object", o)
          dislikedMovies.push(JSON.parse(o));
        });
      }

      const dislikedMoviesimdbids = dislikedMovies.map(m => m.imdbID);
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
      }
      //console.log('b');
      else {
        return setFilteredData(movieData);
      }
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
    fetchData();
    filterMovieData(movieData);
    console.log(movieData);
  }, []);

  return (
    <SafeAreaView style={styles.pageContainer}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#5500dc" />
        </View>
      ) : (
        <View style={styles.animatedStack}>
          {!filteredData.length == 0 ? (
            <>
              <AnimatedStack
                data={filteredData}
                renderItem={({item}) => <Card movie={item} />}
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
                setCurrentMovie={setCurrentMovie}
              />
            </>
          ) : (
            <Text stlye={styles.error}>No Movie Data</Text>
          )}
        </View>
      )}

      <TopRow screen="HOME" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  animatedStack: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    width: '100%',
    height: '100%',
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
