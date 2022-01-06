import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, useWindowDimensions, Image} from 'react-native';
import Card from '../component/ShowCard/';
import users from '../../assets/data/users.js';
import AnimatedStack from '../component/AnimatedStack/';

const HomeScreen = () => {

  const onSwipeLeft = (user) => {
      console.log('LEFT')
  } 
  const onSwipeRight = (user) => {
    console.log('RIGHT')
  } 
   
  return (
      <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        renderItem = {({item}) => <Card user={item} />}
        onSwipeLeft = {onSwipeLeft}
        onSwipeRight = {onSwipeRight}>
      </AnimatedStack>   
      </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }

});

export default HomeScreen;
