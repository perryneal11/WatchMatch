import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useNavigation } from '@react-navigation/native';
 
const TopRow  = () => {
    const [activeScreen, setActiveScreen] = React.useState('')
    const color = "#b5b5b5"
    const activeIconColor = "red"
    const navigation = useNavigation();


return <View style ={styles.topNavigation}>
<Pressable onPress={() => {setActiveScreen('HOME'),navigation.navigate('Home') }}>
  <Fontisto name="tinder" size = {24} color={activeScreen === 'HOME' ? activeIconColor : color}></Fontisto>
</Pressable>
<Pressable onPress={() => {setActiveScreen('MATCHES'); navigation.navigate('Matches');}}>
  <Ionicons name="ios-chatbubbles" size = {24} color={activeScreen === 'MATCHES' ? activeIconColor : color}></Ionicons>
</Pressable>
<Pressable onPress={() => setActiveScreen('FRIENDS')}>
  <MaterialCommunityIcons name="star-four-points" color={activeScreen === 'FRIENDS' ? activeIconColor : color} size = {24} ></MaterialCommunityIcons>
</Pressable>
<Pressable onPress={() => {setActiveScreen('PROFILE'); navigation.navigate('Profile');}}>
<FontAwesome name = "user" color={activeScreen === 'PROFILE' ? activeIconColor : color} size = {24}></FontAwesome>
</Pressable>
</View>
 
}

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





