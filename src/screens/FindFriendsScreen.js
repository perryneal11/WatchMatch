import React, { useState }  from "react";
import {View, Text, SafeAreaView, StyleSheet, ActivityIndicator, FlatList, Button, Image} from 'react-native';
import TopRow from "../component/ButtonBars/topRow";
import {Auth, DataStore, Predicates} from 'aws-amplify'
import { useEffect } from "react/cjs/react.development";
import {User} from '../models'
import { TextInput } from "react-native-gesture-handler";

const FindFriendsScreen = () => {

    const [user, setUser] = useState({});
    const [friends, setFriends] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [potentialFriends, setPotentialFriends] = useState([])
    const [query, setQuery] = useState(null)

    const getCurrentUser = async ()=> {
        const user = await Auth.currentAuthenticatedUser()
        const dbUsers = await DataStore.query(User, u => u.awsID === user.attributes.sub)
        const dbUser = dbUsers[0]
        return setUser(dbUser)
        }
    
    const getFriendsList = async () => {
        const friendsList = user.friends
        const friendsFromDb = await DataStore.query(User, u => u.awsID in friendsList)
        return setFriends(friendsFromDb)
        } 

    const getPotentialFriends = async () => {
        const potentialFriendsVar = await DataStore.query(User, Predicates.ALL , {  
            page: 0,
            limit: 2})
        return setPotentialFriends(potentialFriendsVar)
    }    

    const search = async () => {
        setIsLoading(true)
        console.log("query", query)
        const potentialFriendsVar = await DataStore.query(User, u => u.username("contains", query.toLowerCase()) , {  
            page: 1,
            limit: 10})
            console.log(potentialFriendsVar)
        
        if (potentialFriendsVar.length > 0){
          setIsLoading(false)
          return setPotentialFriends(potentialFriendsVar)
        } else {
          setIsLoading(false)
          return 
        }
        
    }    

    const sendFriendRequest = async () => {
      
    }
    
    useEffect(()=> {
        setIsLoading(false)
        getCurrentUser()
        getPotentialFriends()
    }, [])

    if (isLoading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#5500dc" />
          </View>
        );
      }
    
      if (error) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18}}>
              Error fetching data... Check your network connection!
            </Text>
          </View>
        );
      }
      else{
          
      
    return(
            
        <SafeAreaView style = {styles.root}>
          {console.log("user", user),
           console.log('potential friends Varf', potentialFriends)}
 
            <Text>Find Friends</Text>
            <TextInput 
                onChangeText={newQuery => setQuery(newQuery)}
                style={{ backgroundColor: '#fff', paddingHorizontal: 20 }}>
            </TextInput>
            <Button title="Search" onPress={() => search(query)}></Button>
            <FlatList
                data={potentialFriends}
                keyExtractor={item => item.first}
                renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image key = {item.awsID}/>
            <View style={styles.metaInfo}>
              <Text style={styles.title}>{item.username}</Text>
            </View>
            <View>
              <Button title= "Add" onPress={() => sendFriendRequest(item.awsID) }   ></Button>
            </View>
          </View>
        )}
      />
                 <TopRow screen = "FRIENDS"></TopRow>
        </SafeAreaView>
    )}}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        flex: 3,
        padding: 10
    },
    users:{
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    user: {
        width: 100,
        height: 100,
        margin: 10,
        borderWidth: 2,
        borderRadius: 50,
        borderColor: 'black',
        padding: 3
    }, 
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50
        
    },
    listItem:{
      borderColor: "black",
      borderWidth: 3,
      margin: 3
    }
}) 

export default FindFriendsScreen 