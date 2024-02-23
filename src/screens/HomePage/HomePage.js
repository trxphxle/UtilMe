import {View, Text, StyleSheet, Image} from 'react-native';
import DrawerNavigator from '../Navigation/DrawerNavigator';
import messaging from '@react-native-firebase/messaging';

import React from 'react';
////////////////////////////////////////////////////request user permission///////////////////////////////////////
//this is needed to be called when the app is opened so ima place it here cause this page is always
//opened when the app is turned on
const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};
requestUserPermission();
//////////////////////////////////////////////////////end of userpermission for notifs////////////////////////////////////////
const HomePage = () => {
  return <DrawerNavigator />;
};

const format = StyleSheet.create({
  root: {
    //flex: 1,
    backgroundColor: '#F5E9BE',
  },
});
export default HomePage;
