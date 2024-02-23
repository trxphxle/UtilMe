import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import background from '../../../assets/images/Background8.png';
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {Swipeable} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

const NotificationPage = ({navigation}) => {
  ///////////////////////////////////////////LOAD FCM TOKEN FUCNTIONS WITH CODE/////////////////////////////////////////
  /*
//gets current userID
  function getCurrentUserID() {
    const currentUser = auth().currentUser;
    const userID = currentUser.uid;
    return userID;
  }

  //this async function is gonna allow us to get fcm token from firestore when needed
  async function loadFCMToken(userID) {
    const documentSnapshot = await firestore()
      .collection('UserInfo')
      .doc(userID)
      .get();
    const userData = documentSnapshot.data();
    const fcmToken = userData.fcmToken;
    return fcmToken;
  }
  //this is code that you would add to a function to check if you have properly gotten the token
try {
            const uid2 = getCurrentUserID();
            const token2 = await loadFCMToken(uid2);
            console.log('succes with loading token', token2);
          } catch (error) {
            console.log('error with loading fcm token:', error);
          }

  */
  /*
  /////////////////BEST to call this in the homepage screen and let user turn it off in the setting with toggle switch///////////////////////////////
  //used to see if we can request permision from user to send notifcations
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (requestUserPermission()) {
    //we use this asynch function to get the token
    /*
    async function GetToken() {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      //returns token to the console
      console.log('Token:', token);
    }
    //calls the function and runs it
    GetToken();
   */
  //FirebaseCloudmessages////////////

  //gets current userID
  function getCurrentUserID() {
    const currentUser = auth().currentUser;
    const userID = currentUser.uid;
    return userID;
  }
  const userID = getCurrentUserID();
  //defineing refrerance to comeback to where we will store the notificiation
  const notificationsRef = firestore().collection('notifications');
  const userCollectionRef = firestore()
    .collection('UserInfo')
    .doc(userID)
    .collection('notifications');
  //defining a state variable to hold the notification data
  const [notifications, setNotifications] = useState([]);

  //set react native cloud messaging to receive notifications
  //and stores them in the firestore collection knwon as notificationsRefreance
  //this chunk of code is used when thee app is open and in view

  //Make Test Notification`````````````````````````````````````````````````````
  const userNotificationPrefCollection = firestore()
    .collection('UserInfo')
    .doc(userID)
    .collection('NotificationPref');
  const addNewNotification = () => {
    // Retrieve the user's notification preferences
    userNotificationPrefCollection
      .limit(1)
      .get()
      .then(querySnapshot => {
        const documentSnapshot = querySnapshot.docs[0];
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          const notificationReceiver = data.receiveNotifications;
          if (notificationReceiver) {
            // User wants to receive notifications, so send the notification
            const notification = {
              title: 'Test',
              body: 'this is the body',
              createdAt: new Date().getTime(),
            };
            userCollectionRef.add(notification);
            Alert.alert(notification.title, notification.body);
            console.log('Sent notification.');
          } else {
            // User has turned off notifications, so do not send the notification
            console.log('User has turned off notifications.');
          }
        } else {
          console.log('User document does not exist.');
        }
      })
      .catch(error => {
        console.log('Error getting user document:', error);
      });
  };
  //``````````````````````````````````````````````````````````````````````````

  useEffect(() => {
    messaging().requestPermission();
    //this is where we will go when we recieve a notification and the app is fully closed
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const notification = {
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            createdAt: new Date().getTime(),
          };
          userCollectionRef.add(notification);
          console.log('notifciation casued app to open from quit state');
        }
      });
    //this will be called when the app is open and in view
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const notification = {
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        createdAt: new Date().getTime(),
      };
      await userCollectionRef.add(notification);
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
      console.log(
        'this caused the a notifcation to be recieved when the app is open and in view',
        remoteMessage,
      );
    });
    return unsubscribe;
  }, []);
  //this opens app from the background
  useEffect(() => {
    messaging().requestPermission();
    const unsubscribe = messaging().onNotificationOpenedApp(
      async remoteMessage => {
        const notification = {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          createdAt: new Date().getTime(),
        };
        await userCollectionRef.add(notification);
        console.log(
          'this opens causes the app to open up when its running in the backgroundk',
          remoteMessage,
        );
      },
    );
    return unsubscribe;
  }, []);
  //in the useeffect were using this to rettrieve  notifications from the firestore and
  //set the state with data
  useEffect(() => {
    const unsubscribe = userCollectionRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const newNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          body: doc.data().body,
        }));
        setNotifications(newNotifications);
      });
    return unsubscribe;
  }, []);
  //clears all notifications from the screen, deletes them from the firestore
  const clearAllNotifications = async () => {
    setNotifications([]);
    const snapshot = await userCollectionRef.get();
    snapshot.forEach(doc => {
      userCollectionRef.doc(doc.id).delete();
    });
  };
  //deletes notifcation one by one when swiped on
  const deleteNotification = id => {
    setNotifications(notifications.filter(item => item.id !== id));
    userCollectionRef.doc(id).delete();
  };
  //renders the notifcation list
  const renderNotification = ({item}) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity onPress={() => deleteNotification(item.id)}>
          <View style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </View>
        </TouchableOpacity>
      )}>
      <View style={styles.itemContainer}>
        <View style={styles.flatlist}>
          <View style={{flexDirection: 'column', marginLeft: 10, marginTop: 5}}>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                {item.title}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  marginLeft: 10,
                  marginBottom: 5,
                }}>
                {item.body}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
  return (
    <View>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={styles.image}>
        <View style={styles.container}>
          <FlatList
            style={{
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              elevation: 2,
            }}
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
          />
          {/*make basic notification */}
          <View style={{width: '70%', alignSelf: 'center'}}>
            <TouchableOpacity
              onPress={addNewNotification}
              style={styles.daButton}>
              <Text style={styles.dabuttonText}>Test New Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={clearAllNotifications}
              style={styles.daButton}>
              <Text style={styles.dabuttonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 5,
  },
  image: {
    justifyContent: 'center',
  },
  flatlist: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  deleteButton: {
    backgroundColor: '#c8374a',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    width: 100,
    height: '100%',
    borderRadius: 30,
  },
  deleteButtonText: {
    color: 'white',
    fontsize: 16,
    fontWeight: 'bold',
    marginRight: 9,
  },
  daButton: {
    backgroundColor: 'lightgray',
    padding: 13,
    borderRadius: 30,
    marginTop: 4,
  },
  dabuttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContainer: {
    //padding: 10,
    //backgroundColor: "#FFF",
    margin: 5,
    //marginHorizontal: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
});
export default NotificationPage;
