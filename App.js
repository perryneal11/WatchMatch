import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import HomeScreen from './src/screens/Homescreen.js';
import ProfileScreen from './src/screens/ProfileScreen.js';
import FindFriendsScreen from './src/screens/FindFriendsScreen.js';
import { NavigationContainer, useLinkProps, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MatchesScreen from './src/screens/MatchesScreen.js';
import Amplify from 'aws-amplify'
import {Auth, DataStore} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native'
import config from './src/aws-exports.js'
import {User} from './src/models';
import WatchMatchesScreen from './src/screens/WatchMatchesScreen.js';

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const App = () => {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const getCurrentUser = async ()=> {
        const who = await Auth.currentAuthenticatedUser()
        console.log("who", who)
        const dbUsers = await DataStore.query(User, u => u.awsID('eq', who.attributes.sub))
        console.log("dbusers", dbUsers)    
        if(dbUsers.length < 1) {
          const authUser = await Auth.currentAuthenticatedUser()
          const newUser = new User({
              Netflix: false,
              Prime: false,
              awsID: authUser.attributes.sub,
              username: authUser.attributes.email
          })
          await DataStore.save(newUser)
          Alert.alert("New user created")  
          
      
          
              return;
            } else {
                
                const dbUser = dbUsers[0];
                setUser(dbUser)
 
               
            }

    }
    getCurrentUser();
},[])

console.log("user from app", user)
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <SafeAreaView style = {styles.root}>
      <View style={styles.pageContainer}>
        {user != null ? ( <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component = {HomeScreen} initialParams={{'user': user}} ></Stack.Screen>
          <Stack.Screen name="Matches" component = {MatchesScreen} initialParams={{'user': user}} ></Stack.Screen>
          <Stack.Screen name="FindFriends" component = {FindFriendsScreen} initialParams={{'user': user}} ></Stack.Screen>
          <Stack.Screen name="Profile" component = {ProfileScreen} initialParams={{'user': user}} ></Stack.Screen>
          <Stack.Screen name="WatchMatches" component = {WatchMatchesScreen} initialParams={{'user': user}} ></Stack.Screen>

        </Stack.Navigator>):(<Text>No user</Text>)}
       
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
