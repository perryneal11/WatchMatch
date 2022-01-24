import React, { useState, Component }  from "react";
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import users from '../../assets/data/users'
import TopRow from "../component/ButtonBars/topRow";
import {Auth, DataStore} from 'aws-amplify'
import { useEffect } from "react/cjs/react.development";
import {User} from '../models'

const MatchesScreen = () => {

    const [user, setUser] = useState({});
    const [friends, setFriends] = useState();

    const getCurrentUser = async ()=> {
        const user = await Auth.currentAuthenticatedUser()
        const dbUsers = await DataStore.query(User, u => u.awsID === user.attributes.sub)
        const dbUser = dbUsers[0]
        return setUser(dbUser)
        }
    
    const getFriendsList = async () => {
        const friendsList = user.friends
        const friendsFromDb = await DataStore.query(User, u => u.awsID in friendsList)
        console.log('friends from db', friendsFromDb)
        return setFriends(friendsFromDb)
        } 
    
    useEffect(()=> {
        getCurrentUser()
        console.log('user', user)
        getFriendsList()
        console.log('friends list' , friends)
    }, [])

    return(
        <SafeAreaView style = {styles.root}>
            <TopRow screen = "MATCHES"></TopRow>
            <Text>Youre Friends</Text>
            <View style={users}>
                {friends ? (
                    friends.map(friend => (
                        <View style = {styles.user}>
                        <Text>{friend.username}</Text>
                        </View>
                    ))) : (<Text>No Friends</Text>)}
            </View>
        </SafeAreaView>
    )}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        flex: 1,
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
        
    }
}) 

export default MatchesScreen 