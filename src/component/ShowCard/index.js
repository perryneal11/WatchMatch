import React, {useState, useCallback, Alert} from 'react';
import {
  Text,
  Button,
  View,
  ImageBackground,
  StyleSheet,
  Pressable,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const Card = props => {
  const {title, url, overview, movie, video} = props.movie;
  const [playing, setPlaying] = useState(false);

  const image = 'https://image.tmdb.org/t/p/w300/' + props.movie.backdropPath;
  //const image = "https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1638549265/amc-cdn/production/2/movies/66500/66520/PosterDynamic/132670.jpg"
  console.log('hello there', props.movie, typeof props.movie);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  return (
    <View style={styles.card}>
      <View pointerEvents="none" styles ={styles.videoContainer}>
      <YoutubePlayer
        height={'70%'}
        width={'100%'}
        play={playing}
        videoId={video}
        style={styles.video}
        onChangeState={onStateChange}
      />

      </View>

      <View style={styles.cardInner}>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.description}>{overview}</Text>
      </View>
      <Pressable style={styles.play}>
        <Text onPress={togglePlaying}>{playing ? 'pause' : 'play'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  cardInner: {
    padding: 10,
  },
  name: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  play: {
    backgroundColor: '#D6173c',
    height: '10%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
});
export default Card;
