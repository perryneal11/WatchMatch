import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import TopRow from '../component/ButtonBars/topRow';
import {Auth, DataStore} from 'aws-amplify';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {User} from '../models';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {TextInput} from 'react-native-gesture-handler';

const ProfileScreen = props => {
  const [netflix, setNetflix] = useState(true);
  const [prime, setPrime] = useState(true);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = props.route.params.user;

  const signOut = async () => {
    try {
      await DataStore.clear;
      Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  const save = async () => {
    if (user) {
      const updateUser = User.copyOf(user, updated => {
        (updated.Prime = prime), (updated.Netflix = netflix);
      });
      await DataStore.save(updateUser);
      Alert.alert('User updated');
    } else {
      //create new user
      const authUser = await Auth.currentAuthenticatedUser();
      const newUser = new User({
        Netflix: netflix,
        Prime: prime,
        awsID: authUser.attributes.sub,
        username: authUser.attributes.email,
      });
      await DataStore.save(newUser);
      Alert.alert('New user created');
    }
  };

  useEffect(() => {
    setNetflix(user.Netflix);
    setPrime(user.Prime);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {console.log('hello', user)}

      <View style={styles.userPicContainer}>
        <Image
          style={styles.userPic}
          source={{
            uri: 'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png',
          }}
        />
      </View>

      <View style={styles.usernameContainer}>
        <TextInput
          onChangeText={newUsername => {
            setUsername(newUsername);
          }}
          style={styles.usernameInput}
        />
        <Pressable
          onPress={() => editusername()}
          style={styles.editUsernameButton}>
          <AntDesign name="edit"
          style={styles.editUsernameButton}>Edit</AntDesign>
        </Pressable>
      </View>

      <View style = {styles.streamingServicesContainer}>
      <Text style={styles.streamingServicesText}> Streaming Services</Text>
      <Pressable style={styles.option}>
        <BouncyCheckbox
          text="Netflix"
          disableBuiltInState
          isChecked={netflix}
          onPress={() => {
            setNetflix(!netflix);
          }}
        />
      </Pressable>
      <Pressable style={styles.option}>
        <BouncyCheckbox
          text="Prime"
          disableBuiltInState
          isChecked={prime}
          onPress={() => {
            setPrime(!prime);
          }}
        />
      </Pressable>
      </View>




      <View style={styles.bottomButtonContainer}>
        <Pressable onPress={save} style={styles.button}>
          <Text>Save changes</Text>
        </Pressable>

        <Pressable onPress={signOut} style={styles.button}>
          <Text>Sign out</Text>
        </Pressable>
      </View>
      <TopRow screen="PROFILE"></TopRow>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 4,

  },
  userPicContainer:{
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,

  },
  userPic:{
    height:225,
    width: 225,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 225/2
  },
  usernameContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  usernameInput: {
    height: '40%',
    width: '80%',
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
  },
  editUsernameButton: {
    fontSize: 20,
    textAlignVertical: 'center'
  },
  streamingServicesContainer:{
      flex: 1,
      alignItems: 'center',

  },
  streamingServicesText:{
    fontSize: 20,
    margin: 5,
  },
  option: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  bottomButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,

  },
  button: {
    backgroundColor: '#D6173c',
    height: '30%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
});

export default ProfileScreen;
