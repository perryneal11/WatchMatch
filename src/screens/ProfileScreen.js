import React, {useState} from "react";
import {View, Text, SafeAreaView, StyleSheet, Image, Pressable} from 'react-native';
import TopRow from "../component/ButtonBars/topRow";
import {Auth, DataStore} from 'aws-amplify'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {User} from '../models'

const ProfileScreen = () => {

    const [netflix, setNetflix] = useState(true)
    const [prime, setPrime] = useState(true)
    const user = Auth.currentAuthenticatedUser();


    const save =() => { 
        const newUser = new User({
            Netflix: netflix
            
    })

        DataStore.save(newUser)
    };
    
    return(
        <SafeAreaView style = {styles.root}>
            <View style = {styles.container}>
            <TopRow></TopRow>
            <Text> Streaming Services</Text>
            
            <Pressable  style={styles.option}>
            <BouncyCheckbox 
                isPressed={netflix}
                onPress={setNetflix} />
                <Text ></Text>
            </Pressable>

            <Pressable onPress={save} style = {styles.button}>
                <Text>Save changes</Text>
            </Pressable>

            <Pressable onPress={Auth.signOut} style = {styles.button}>
                <Text>Sign out</Text>
            </Pressable>

            </View>
        </SafeAreaView>
    )}

const styles = StyleSheet.create({
    root: {
        width: '100%',
        flex: 1,
        padding: 10
    },
    button: {
        backgroundColor: '#D6173c',
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        margin: 10
    },
    container: {
        padding: 10 
    },
    option: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        padding: 10
    },
    checkbox: {
        justifyContent: 'flex-start'
    }
 }) 

export default ProfileScreen 