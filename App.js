import React from 'react';
import {View, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import HomeScreen from './src/screens/Homescreen.js';
import ProfileScreen from './src/screens/ProfileScreen.js';
import FindFriendsScreen from './src/screens/FindFriendsScreen.js';
import { NavigationContainer, useLinkProps, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchesScreen from './src/screens/MatchesScreen.js';
import Amplify from 'aws-amplify'
import {withAuthenticator} from 'aws-amplify-react-native'
import config from './src/aws-exports.js'

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const App = () => {

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <SafeAreaView style = {styles.root}>
      <View style={styles.pageContainer}>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component = {HomeScreen} ></Stack.Screen>
          <Stack.Screen name="Matches" component = {MatchesScreen} options = {headerBackVisible = false}></Stack.Screen>
          <Stack.Screen name="FindFriends" component = {FindFriendsScreen} options = {headerBackVisible = false}></Stack.Screen>
          <Stack.Screen name="Profile" component = {ProfileScreen} options = {headerBackVisible = false}></Stack.Screen>
        </Stack.Navigator>
      </View>
      </SafeAreaView>
      </NavigationContainer>
  );
};

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

export default withAuthenticator(App);
