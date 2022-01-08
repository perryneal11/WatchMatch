import React from 'react';
import {View, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import HomeScreen from './src/screens/Homescreen.js';

import { NavigationContainer, useLinkProps, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchesScreen from './src/screens/MatchesScreen.js';

const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <SafeAreaView style = {styles.root}>
      <View style={styles.pageContainer}>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component = {HomeScreen} ></Stack.Screen>
          <Stack.Screen name="Matches" component = {MatchesScreen} options = {headerBackVisible = false}></Stack.Screen>
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

export default App;
