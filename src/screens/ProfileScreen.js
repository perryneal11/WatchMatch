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
  const user = props.route.params.user;
  const getCurrentUser = props
  const [netflix, setNetflix] = useState(true);
  const [prime, setPrime] = useState(true);
  const [username, setUsername] = useState(user.username);
  const [isLoading, setIsLoading] = useState(false);
  const [changesMade, setChangesMade] = useState(false)
  const [usernameIsEditing, setusernameIsEditing] = useState(false);


  const signOut = async () => {
    try {
      await DataStore.clear;
      Auth.signOut();
    } catch (error) {
      //console.log('error signing out: ', error);
    }
  };

  const usernameChanged = (newUsername) => {
    setUsername(newUsername) 
    setChangesMade(true)
  }

  const editusername = async () => {
    
    if (usernameIsEditing == true){
      setusernameIsEditing(false)
      console.log("wtf", usernameIsEditing)

    }
    else if (usernameIsEditing == false){
      setusernameIsEditing(true)
      console.log("wtf", usernameIsEditing)
    }
  };

  const save = async () => {
    if (user) {
      const updateUser = User.copyOf(user, updated => {
        (updated.Prime = prime), (updated.Netflix = netflix), (updated.username = username);
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
    console.log('hit')
  };

  useEffect(() => {
    getCurrentUser
    setNetflix(user.Netflix);
    setPrime(user.Prime);
    setUsername(user.username)
  }, []);

  return (
    <SafeAreaView style={styles.root}>
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
          onChangeText={newUsername => usernameChanged(newUsername)}
          style={styles.usernameInput}
          autoCorrect={false}
          editable={usernameIsEditing}
          placeholder={user.username}
          
        />
        <Pressable
          onPress={() => editusername()}
          style={styles.editUsernameButton}
          >
          <AntDesign name="edit" style={styles.editUsernameButton}>
            Edit
          </AntDesign>
        </Pressable>
      </View>

      <View style={styles.streamingServicesContainer}>
        <Text style={styles.streamingServicesText}> Streaming Services</Text>
        <Pressable style={styles.option}>
          <BouncyCheckbox
            text="Netflix"
            disableBuiltInState
            isChecked={netflix}
            onPress={() => {
              setNetflix(!netflix);
              setChangesMade(true)
            }}
          />
        </Pressable>
        <Pressable 
          style={styles.option}
          >
          <BouncyCheckbox
            text="Prime"
            disableBuiltInState
            isChecked={prime}
            onPress={() => {
              setPrime(!prime);
              setChangesMade(true)
            }}
          />
        </Pressable>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Pressable 
          style={styles.button}
          disabled={false}
          onPress={() => {
            save()
            }} >
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
  userPicContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  userPic: {
    height: 225,
    width: 225,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 225/2,
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
    fontSize: 20,
  },
  editUsernameButton: {
    fontSize: 20,
    textAlignVertical: 'center',
  },
  streamingServicesContainer: {
    flex: 1,
    alignItems: 'center',
  },
  streamingServicesText: {
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
