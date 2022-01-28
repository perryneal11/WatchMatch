import React, { useState }  from "react";
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import TopRow from "../component/ButtonBars/topRow";
import {Auth, DataStore, Predicates} from 'aws-amplify'
import { useEffect } from "react/cjs/react.development";
import {Friendship, FriendshipUser, User} from '../models'
import { PredicateAll } from "@aws-amplify/datastore/lib-esm/predicates";

const MatchesScreen = () => {

    const [user, setUser] = useState({});
    const [friends, setFriends] = useState();

    const getCurrentUser = async ()=> {
        const userVar = await Auth.currentAuthenticatedUser()
        const dbUsers = await DataStore.query(User, u => u.awsID("eq", userVar.attributes.sub))
        const dbUser = dbUsers[0];
        return setUser(dbUser)
        }
    
    const getFriendsList = async () => {
        
        const usersFriendships = (await DataStore.query(FriendshipUser)).filter( fu => fu.user.id == user.id).map(fu => fu.friendship.id)
        console.log("users friendships", usersFriendships)
        const usersLinkedToSameFriendship = (await DataStore.query(FriendshipUser)).filter(fu => usersFriendships.includes(fu.friendship.id) && fu.user.username != user.username).map(fu=> fu.user)
        console.log("users with same friendships",usersLinkedToSameFriendship )
        setFriends(usersLinkedToSameFriendship)
    
    }
    
    useEffect(()=> {
        getCurrentUser()
        getFriendsList()
    }, [])

    return(
        <SafeAreaView style = {styles.root}>

            <Text>Youre Friends</Text>
            <View style={styles.users}>
                {friends ? (
                    friends.map(friend => (
                        <View key={friend.id}>
                        <Text>{friend.username}</Text>
                        </View>
                    ))) : (<Text style ={styles.users}>No Friends</Text>)}
            </View>
            <TopRow screen = "MATCHES"></TopRow>
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
        flexWrap: 'wrap',
        flex: 1
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