import {View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList,Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const OrderHistoryPage = () => {
  const [userInfo, setUserInfo] = useState([]); //Set Current user info

  //2)Get UserInfo from currently log in user
  const getUser = async () => {
    //get user info
    // await firestore()
    //   .collection('UserInfo')
    //   .doc(auth().currentUser.uid)
    //   .collection('OrderReceived')
    //   .get()
    //   .then(documentSnapshot => {
    //     if (documentSnapshot.exists) {
    //       setUserInfo(documentSnapshot.data());
    //     }
    //   });
    firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .collection('OrderReceived')
      .onSnapshot(querySnapShot => {
        const userInfo = [];

        querySnapShot.forEach(doc => {
          const {Client} = doc.data();
          const {Joborder} = doc.data();
          const {profilePic} = doc.data();
          const {Subject} = doc.data();
          const {ClientUID} = doc.data();
          const {Status} = doc.data();
          userInfo.push({
            Client,
            id: doc.id,
            Joborder,
            profilePic,
            Subject,
            ClientUID,
            Status,
          });
        });
        setUserInfo(userInfo); //Saves FIRESTORE data into UserInfo via setUserInfo
      });
  };
  //1)Run this code when enter the page
  useEffect(() => {
    getUser();
  }, []);

  const handleCheck = () => {
    Alert.alert('Check', 'Is this information correct?', [
      {
        text: 'Yes',
        onPress: addJobOrder,
      },
      {text: 'No'},
    ]);
  };
  const handleAccept = (item) => {
    //Accept current user
   firestore().collection('UserInfo').doc(auth().currentUser.uid)
   .collection('OrderReceived').doc(item.ClientUID)
   .update({
    Status: 'Accepted'
   });
   //Accept target user
   firestore().collection('UserInfo').doc(item.ClientUID)
   .collection('OrderSent').doc(auth().currentUser.uid)
   .update({
    Status: 'Accepted'
   });
   //Send user notification
   firestore()
    .collection('UserInfo')
    //.where('userId', '==',user.uid)
    .doc(item.ClientUID)
    .collection('notifications')
    .add({
      title: item.Client,
      body: 'Accepted your work order!',
      createdAt: new Date().getTime(),
    });
  };
  const handleDecline = (item) => {
    //Accept current user
   firestore().collection('UserInfo').doc(auth().currentUser.uid)
   .collection('OrderReceived').doc(item.ClientUID)
   .update({
    Status: 'Denied'
   });
   //Accept target user
   firestore().collection('UserInfo').doc(item.ClientUID)
   .collection('OrderSent').doc(auth().currentUser.uid)
   .update({
    Status: 'Denied'
   });
   firestore()
    .collection('UserInfo')
    //.where('userId', '==',user.uid)
    .doc(item.ClientUID)
    .collection('notifications')
    .add({
      title: item.Client,
      body: 'Declined your work order!',
      createdAt: new Date().getTime(),
    });
  };
  const handleComplete = (item) => {
    //Accept current user
   firestore().collection('UserInfo').doc(auth().currentUser.uid)
   .collection('OrderReceived').doc(item.ClientUID)
   .update({
    Status: 'Complete'
   });
   //Accept target user
   firestore().collection('UserInfo').doc(item.ClientUID)
   .collection('OrderSent').doc(auth().currentUser.uid)
   .update({
    Status: 'Complete'
   });
   //Send user notifcation
   firestore()
    .collection('UserInfo')
    //.where('userId', '==',user.uid)
    .doc(item.ClientUID)
    .collection('notifications')
    .add({
      title: item.Client,
      body: 'Completes your work order!',
      createdAt: new Date().getTime(),
    });
  };
  const handleCancel = (item) => {
    //Accept current user
   firestore().collection('UserInfo').doc(auth().currentUser.uid)
   .collection('OrderReceived').doc(item.ClientUID)
   .update({
    Status: 'Canceled'
   });
   //Accept target user
   firestore().collection('UserInfo').doc(item.ClientUID)
   .collection('OrderSent').doc(auth().currentUser.uid)
   .update({
    Status: 'Canceled'
   });
   //Send notification
   firestore()
    .collection('UserInfo')
    //.where('userId', '==',user.uid)
    .doc(item.ClientUID)
    .collection('notifications')
    .add({
      title: item.Client,
      body: 'Canceled your work order!',
      createdAt: new Date().getTime(),
    });
  };
  const handleClear = (item) => {
    //Accept current user
   firestore().collection('UserInfo').doc(auth().currentUser.uid)
   .collection('OrderReceived').doc(item.ClientUID)
   .delete()
   .then(() => {console.log('Job Deleted')});

  };
  return (
    <View>
      <View>
        <Text style={styles.header}>My Job Orders</Text>
        <FlatList
           style={{height: '91.1%'}}
          data={userInfo}
          renderItem={({item}) => {
            let statusComponent = null;
            if (item.Status === 'Sent') {
              statusComponent = (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAccept(item)}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => handleDecline(item)}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            } else if (item.Status === 'Accepted') {
              statusComponent = (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Text style={{color: 'red', marginRight: 10}}>Accepted</Text> */}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleComplete(item)}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Complete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button3}
                    onPress={() => handleCancel(item)}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            } else if (item.Status === 'Denied') {
              statusComponent = (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.button2}
                   >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Request Declined
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button3}
                    onPress={() => handleClear(item)}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }
            else if (item.Status === 'Complete') {
              statusComponent = (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.button4}
                   >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Job Complete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() => handleClear(item)}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }
            else if (item.Status === 'Canceled') {
              statusComponent = (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.button2}
                   >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'black',
                        textAlign: 'center',
                      }}>
                      Job Canceled
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleClear(item)}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }
            return (
              <View style={styles.container}>
                <View style={{flexDirection: 'row', alignContent: 'center'}}>
                  <Image
                    style={{height: 90, width: 90, borderRadius: 5}}
                    source={{uri: item.profilePic}}
                  />
                  <View style={{marginTop: 1, marginLeft: 10, marginRight: 70}}>
                    <Text style={styles.text}>{item.Client}</Text>
                    {item.Status === 'Sent' &&(
                      <Text style={styles.text}>New Job</Text>
                    )}
                    {item.Status === 'Denied' &&(
                      <Text style={styles.text}>Job Denied</Text>
                    )}
                    {item.Status === 'Complete' &&(
                      <Text style={styles.text}>Job Completed</Text>
                    )}
                    {item.Status === 'Accepted' &&(
                      <Text style={styles.text}>Job Inprogress</Text>
                    )}
                    {item.Status === 'Canceled' &&(
                      <Text style={styles.text}>Job Canceled</Text>
                    )}
                  
                    <Text>{item.Subject}</Text>
                    <Text>{item.Joborder}</Text>
                  </View>
                </View>
                <Text style={{marginLeft: 10, marginTop: 5}}></Text>
                {statusComponent}
              </View>
            );
          }}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter',
    fontSize: 15.5,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 2,
    textShadowColor: 'white',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
header: {
  fontWeight: 'bold',
  fontSize: 18,
  justifyContent: 'center',
  alignItems: 'center',
  height: 50,
  color: 'black',
  textAlign: 'center',
  marginTop: 10
  
},
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 11,
  },
  button:{
    backgroundColor: '#FF9666',
    borderRadius: 40,
   width: "50%",
    height: 45,
    padding: 13,
  },
  button2:{
    backgroundColor: '#F5F6F9',
    borderRadius: 40,
   width: "50%",
    height: 45,
    padding: 13,
  },
  button3:{
    backgroundColor: '#e63939',
    borderRadius: 40,
   width: "50%",
    height: 45,
    padding: 13,
  },
  button4:{
    backgroundColor: '#1bb54c',
    borderRadius: 40,
   width: "50%",
    height: 45,
    padding: 13,
  },
});
export default OrderHistoryPage