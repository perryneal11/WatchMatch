import React, {useEffect, useState} from "react";
import {View, Text, SafeAreaView, StyleSheet, Image, Pressable, Alert} from 'react-native';
import TopRow from "../component/ButtonBars/topRow";
import {Auth, DataStore} from 'aws-amplify'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {User} from '../models'

const ProfileScreen = () => {
    const [user, setUser] = useState(null)
    const [netflix, setNetflix] = useState(true)
    const [prime, setPrime] = useState(true)

    useEffect(() => {
        const getCurrentUser = async ()=> {
            const user = await Auth.currentAuthenticatedUser()
            const dbUsers = await DataStore.query(User, u => u.awsID === user.attributes.sub)
                if(dbUsers.length < 0) {
                    return;
                }
            const dbUser = dbUsers[0];
            setUser(dbUser)
            setNetflix(dbUser.Netflix)
            setPrime(dbUser.Prime)
        }
        getCurrentUser();

    },[])

    const save = async () => { 
        if(user) {
            const updateUser = User.copyOf(user, updated => {
                updated.Prime = prime,
                updated.Netflix = netflix
            })
            await DataStore.save(updateUser)
            Alert.alert("User updated")
        } else {
            //create new user 
            const authUser = await Auth.currentAuthenticatedUser()
            const newUser = new User({
                Netflix: netflix,
                Prime: prime,
                awsID: authUser.attributes.sub,
                username: authUser.attributes.email
            })
            await DataStore.save(newUser)
            Alert.alert("New user created")
        }
    };
    
    return(
        <SafeAreaView style = {styles.root}>
            <View style = {styles.container}>
            <TopRow screen = "PROFILE"></TopRow>
            <Text> {user.username}</Text>
            <Text> Streaming Services</Text>
            <Pressable style={styles.option}>
            <BouncyCheckbox 
                text="Netflix"
                disableBuiltInState
                isChecked={netflix}
                onPress={() => {setNetflix(!netflix)}}/>
            </Pressable>

            <Pressable style={styles.option}>
            <BouncyCheckbox 
                text="Prime"
                disableBuiltInState
                isChecked={prime}
                onPress={() => {setPrime(!prime)}}/>
            </Pressable>

            <View style = {styles.bottom}>
                <Pressable onPress={save} style = {styles.button}>
                    <Text>Save changes</Text>
                </Pressable>

                <Pressable onPress={Auth.signOut} style = {styles.button}>
                    <Text>Sign out</Text>
                </Pressable>
            </View>


            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        padding: 10,
        flex: 1
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
        padding: 10,
        flex: 1
    },
    option: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        padding: 10
    },
    checkbox: {
        justifyContent: 'flex-start'
    },
    bottom: {
        justifyContent: 'flex-end',
        flex: 1
    }
 }) 

export default ProfileScreen 