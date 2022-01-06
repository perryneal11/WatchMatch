import React from 'react';
import {View, StyleSheet} from 'react-native';
import HomeScreen from './src/screens/Homescreen.js';
import MatchesScreen from './src/screens/MatchesScreen.js'

const App = () => {


  return (

      <View style={styles.pageContainer}>
        <MatchesScreen></MatchesScreen>
  
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

export default App;
