import React, {useState} from 'react';
import {View, Switch, StyleSheet} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';


function getCurrentUserID() {
  try{
  const currentUser = auth().currentUser;
  const userID = currentUser.uid;
  return userID;
  }
  catch{}
}

const userID = getCurrentUserID();



function ToggleNotificationButton() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [userInfo, setUserInfo] = useState([]);

  const userNotificationPrefCollection = firestore()
  .collection('UserInfo')
  .doc(userID)
  .get() //added
  .then(documentSnapshot => {
    if (documentSnapshot.exists) {
      setUserInfo(documentSnapshot.data()); //save all UserInfo to userInfo
    }
  });
  //.collection('NotificationPref');

  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    //updates the user notifications on wethere they wish to receive notification or not
    try {
      firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .update({
        //It allows me to edit the user info, while keeping its old information as well.
        receiveNotifications: !isEnabled
      });

      if (!isEnabled) {
        // enable notifications
        const token = await messaging().getToken()
          console.log('enter: ', token);
          firestore().collection('UserInfo').doc(userID).update({
            fcmToken: token,
          });
          console.log('Notification permission granted.');
       
      } else {
        // disable notifications
        messaging().deleteToken().then(() => {
          console.log('Unregistered. Deleted Token');
        }).catch((error) => {
          console.log('Unable to unregister device for remote messages.', error);
        });
      }
      // userNotificationPrefCollection
      //   .limit(1)
      //   .get()
      //   .then(querySnapshot => {
      //     const documentSnapshot = querySnapshot.docs[0];
      //     const notifDocID = documentSnapshot.id;
      //     const userNotifDocRef =
      //       userNotificationPrefCollection.doc(notifDocID);
      //     userNotifDocRef.update({receiveNotifications: !isEnabled});
      //     console.log('notification pref updated in firestore');
      //  });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{false: '#464646', true: '#FF9666'}}
        thumbColor={'white'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 14,
  },
});

export default ToggleNotificationButton;
