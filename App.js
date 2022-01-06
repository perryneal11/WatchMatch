import React from 'react';
import {View, StyleSheet} from 'react-native';
import HomeScreen from './src/screens/Homescreen.js';

const App = () => {


  return (

      <View style={styles.pageContainer}>
        <HomeScreen></HomeScreen>
  
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
