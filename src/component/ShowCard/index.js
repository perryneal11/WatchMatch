import React from 'react';
import {Text, View, ImageBackground, StyleSheet} from 'react-native';

const Card = props => {
  const {name, image, bio} = props.user;
  return (
    <View style={styles.card}>
      <ImageBackground source={{uri: image}} style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{bio}</Text>
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
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  cardInner: {
    padding: 10,
  },
});
export default Card;
