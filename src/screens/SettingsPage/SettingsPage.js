import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toggle from '../../components/SettingComponents/Toggle';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

const SettingsPage = ({navigation}) => {
  //--------Firebase -----------
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState('');
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  //Return active user
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber; // unsubscribe on unmount
  }, []);
  //-------Firebase END------- for logout button
  const SignOff = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
    navigation.navigate('FrontPage');
  };
  //------------------firebase end------------------

  //----------------del firbase account-------------------
  const del = async () => {
    // Delete Firestore document
    const user = firebase.auth().currentUser;
    const userId = user.uid;
    await firestore().collection('UserInfo').doc(userId).delete();

    // Delete Firebase Authentication account
    await user.delete();
    console.log('Account deleted successfully!');

    // Navigate to the front page if navigation object is defined
    navigation.navigate('SignInScreen');
  };
  //----------------------------end Firebase del --------------------

  function logout() {
    Alert.alert(
      'Are you sure you wanna Log Out?',
      'You will have to log in again',
      [
        //these will gives us our options
        {text: 'Log Out', onPress: SignOff}, //figure out how to go back to the homepage if log out button is pressed
        {text: 'Exit', onPress: () => console.log('User has changed her mind')},
      ],
    );
  }

  //del account button
  function delAccount() {
    Alert.alert(
      'Are you sure you wanna delete your account',
      'If you delete your account you will not be able to get it back',
      [
        {
          text: 'Yes',
          onPress: del,
        },
        {
          text: 'No',
          onPress: () => console.log('Changed mind'),
        },
      ],
    );
  }

  return (
    <View style={styles.all}>
      <Text style={styles.text}>Account</Text>

      <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
        <FontAwesome5.Button
          style={{paddingVertical: 11}}
          name="bell"
          color="black"
          backgroundColor="white"
          borderRadius={20}
          iconStyle={{color: 'orange'}}>
          Notification
        </FontAwesome5.Button>
        <Toggle />
      </View>

      <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
        <FontAwesome5.Button
          style={{paddingVertical: 11}}
          onPress={() => navigation.navigate('ApplyServicer')}
          name="file"
          color="black"
          backgroundColor="white"
          borderRadius={20}
          iconStyle={{color: 'orange'}}>
          Apply to become a Servicer
        </FontAwesome5.Button>
      </View>

      <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
        <FontAwesome5.Button
          style={{paddingVertical: 11}}
          onPress={delAccount}
          name="trash"
          color="black"
          backgroundColor="white"
          borderRadius={20}
          iconStyle={{color: 'orange'}}>
          Delete Account
        </FontAwesome5.Button>
      </View>

      <Text style={styles.text}>Account</Text>

      <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
        <FontAwesome5.Button
          style={{paddingVertical: 11}}
          onPress={() => navigation.navigate('Contact Support')}
          name="question-circle"
          color="black"
          backgroundColor="white"
          borderRadius={20}
          iconStyle={{color: 'orange'}}>
          Contact Support
        </FontAwesome5.Button>
      </View>

      <Text style={{paddingTop: 190}}></Text>
      <View style={{paddingTop: 10, paddingLeft: 50, width: '85%'}}>
        <MaterialCommunityIcons.Button
          style={{paddingVertical: 11}}
          onPress={logout}
          name="logout"
          color="#FE5050"
          backgroundColor="#fde2e2"
          borderRadius={20}
          paddingLeft={100}
          iconStyle={{color: '#FE5050'}}>
          Log Out
        </MaterialCommunityIcons.Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  all: {
    paddingTop: 60,
  },
  text: {
    paddingLeft: 16,
    fontSize: 17.5,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 15,
  },
});
export default SettingsPage;
