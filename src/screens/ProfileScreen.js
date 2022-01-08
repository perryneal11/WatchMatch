import React  from "react";
import {View, Text, SafeAreaView, StyleSheet, Image, Pressable} from 'react-native';
import users from '../../assets/data/users'
import TopRow from "../component/ButtonBars/topRow";
import {Auth} from 'aws-amplify'

const ProfileScreen = () => {
    return(
        <SafeAreaView style = {styles.root}>
            <TopRow></TopRow>
            <Text>Profile</Text>
            <Pressable onPress={() => Auth.signOut()}>
                <Text>Sign out</Text>
            </Pressable>
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

export default ProfileScreen 