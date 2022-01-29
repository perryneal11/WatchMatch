import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, Text, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';

const WatchMatchesScreen = ({ route, navigation }) => {

    const friend = route.params
    

    const getShowsInCommon = () => {
        const friendsShows = friend.friend.approvedContentIMDBID
        console.log("friends shows", friendsShows)
        const usersShows = route.params.user.approvedContentIMDBID
        console.log("your shows", friendsShows)
        const combined = usersShows.concat(friendsShows)
        console.log("scombined", combined)
        const showsYouBothLike = combined.filter(s => (friendsShows.includes(s) && usersShows.includes(s)))
        console.log("showsYouBothLike", showsYouBothLike)
        const showsNoDuplicates = [...new Set(showsYouBothLike)];
        console.log("showsNoDuplicates", showsNoDuplicates)

    }

    useEffect(()=> {
        getShowsInCommon()
    },[])



    {console.log("wha",friend.friend)}
    return (
        
        <SafeAreaView>
            <Text>{friend.friend.username}</Text>
            
        </SafeAreaView>
    )
}

export default WatchMatchesScreen;