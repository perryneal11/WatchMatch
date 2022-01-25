import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from '@react-navigation/native';
 
const TopRow  = props => {
    const [activeScreen, setActiveScreen] = React.useState()
    const screen = props
    const color = "#b5b5b5"
    const activeIconColor = "red"
    const navigation = useNavigation();

  useEffect(()=>{
    setActiveScreen(props.screen)
  }, [])

  return( 
  <View style ={styles.topNavigation}>
    <Pressable onPress={() => navigation.navigate('Home')}>
      <MaterialCommunityIcons name="movie-open-outline" size = {24} color={activeScreen === 'HOME' ? activeIconColor : color}></MaterialCommunityIcons>
    </Pressable>
    <Pressable onPress={() =>  navigation.navigate('Matches')}>
      <Fontisto name="persons" size = {24} color={activeScreen === 'MATCHES' ? activeIconColor : color}></Fontisto>
    </Pressable>
    <Pressable onPress={() =>  navigation.navigate('FindFriends')}>
      <AntDesign name="adduser" color={activeScreen === 'FRIENDS' ? activeIconColor : color} size = {24} ></AntDesign>
    </Pressable>
    <Pressable onPress={() =>  navigation.navigate('Profile')}>
    <FontAwesome name = "user" color={activeScreen === 'PROFILE' ? activeIconColor : color} size = {24}></FontAwesome>
    </Pressable>
  </View>
  )}

const styles = StyleSheet.create({
    root: {
      flex: 1
    },
    pageContainer: {
      flex: 1,
    },
    topNavigation:{
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      padding: 10,
    },});
 
export default TopRow;





