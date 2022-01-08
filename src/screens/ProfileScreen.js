import React, {useState} from "react";
import {View, Text, SafeAreaView, StyleSheet, Image, Pressable} from 'react-native';
import users from '../../assets/data/users'
import TopRow from "../component/ButtonBars/topRow";
import {Auth} from 'aws-amplify'
import BouncyCheckbox from "react-native-bouncy-checkbox";

const ProfileScreen = () => {
    const save =() => {};
    const handleCheckboxPress=() => {}
    const [checked, setChecked] = useState(false)

    return(
        <SafeAreaView style = {styles.root}>
            <View style = {styles.container}>
            <TopRow></TopRow>
            <Text>Streaming Services</Text>
            
     
            <Pressable onPress={handleCheckboxPress} style={styles.option}>
            <BouncyCheckbox onPress={( ) => {}} />
                <Text>Netflix</Text>
            </Pressable>


            <Pressable onPress={handleCheckboxPress} style={styles.option}>
            <BouncyCheckbox onPress={( ) => {}} style = {styles.checkbox}/>
                <Text>Disney</Text>
            </Pressable>

            <Pressable onPress={handleCheckboxPress} style={styles.option}>
            <BouncyCheckbox onPress={( ) => {}} />
                <Text>Prime</Text>
            </Pressable>

            <Pressable onPress={handleCheckboxPress} style={styles.option}>
            <BouncyCheckbox onPress={( ) => {}} />
                <Text>Hulu</Text>
            </Pressable>


            <Pressable onPress={() => Auth.signOut()} style = {styles.button}>
                <Text>Sign out</Text>
            </Pressable>

            <Pressable onPress={() => {save}} style = {styles.button}>
                <Text>Save changes</Text>
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