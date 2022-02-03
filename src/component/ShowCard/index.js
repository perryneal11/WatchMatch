import React from 'react';
import {Text, View, ImageBackground, StyleSheet} from 'react-native';

const Card = props => {
  const {title, url, overview} = props.movie;

  
  //const image =  "https://image.tmdb.org/t/p/w300/" + props.image.toString()
  const image = "https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1638549265/amc-cdn/production/2/movies/66500/66520/PosterDynamic/132670.jpg"
  console.log("hello there", props.movie, typeof props.movie)
  
  return (
    <View style={styles.card}>
      <ImageBackground source={{uri: image}} style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{title}</Text>
          <Text style={styles.description}>{overview}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
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
  cardInner: {
    padding: 10,
  },
});
export default Card;
