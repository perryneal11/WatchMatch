import React  from "react";
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import users from '../../assets/data/users'

const MatchesScreen = () => {
    return(
        <SafeAreaView style = {styles.root}>
            <Text>Shows you both like</Text>
            <View style={users}>
                {users.map(user => (
                <View style = {styles.user}>
                    <Image source={{uri: user.image}} style={styles.image}></Image>
                </View>))}
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