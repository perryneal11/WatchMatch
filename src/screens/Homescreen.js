import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, useWindowDimensions, Image} from 'react-native';
import Card from '../component/ShowCard/';
import users from '../../assets/data/users.js';
import AnimatedStack from '../component/AnimatedStack/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopRow from '../component/ButtonBars/topRow';

const HomeScreen = () => {

  const onSwipeLeft = (user) => {
      console.log('LEFT')
  } 
  const onSwipeRight = (user) => {
    console.log('RIGHT')
  } 

  return (
    <View style={styles.pageContainer}>
      <TopRow></TopRow>
      <AnimatedStack
      data={users}
      renderItem = {({item}) => <Card user={item} />}
      onSwipeLeft = {onSwipeLeft}
      onSwipeRight = {onSwipeRight}>
      </AnimatedStack>   
    <View style= {styles.icons}>
      <View style = {styles.button}>
        <FontAwesome name="undo" size={30} color="#FBD88B" />
      </View>
      <View style = {styles.button}>
        <Entypo name="cross" size={30} color="#F76C6B" />
      </View>
      <View style = {styles.button}>
        <FontAwesome name="star" size={30} color="#3AB4CC" />
      </View>
        <View style = {styles.button}>
      <Ionicons name="flash" size={30} color="#A65CD2" />
      </View>
      <View style = {styles.button}>
        <FontAwesome name="heart" size={30} color="#4FCC94" />
      </View>
      </View>
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
