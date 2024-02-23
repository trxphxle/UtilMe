import {View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList,Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const RequestOrderPage = ({navigation}) => {
  const [userInfo, setUserInfo] = useState([]); //Set Current user info

  //2)Get UserInfo from currently log in user
  const getUser = async () => {

    firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .collection('OrderSent')
      .onSnapshot(querySnapShot => {
        const userInfo = [];

        querySnapShot.forEach(doc => {
          const {Servicer} = doc.data();
          const {Joborder} = doc.data();
          const {profilePic} = doc.data();
          const {Subject} = doc.data();
          const {Status} = doc.data();
          const {ServicerUID} = doc.data();
          userInfo.push({
            Servicer,
            id: doc.id,
            Joborder,
            profilePic,
            Subject,
            Status,
            ServicerUID,
          });
        });
        setUserInfo(userInfo); //Saves FIRESTORE data into UserInfo via setUserInfo
      });
  };
  //1)Run this code when enter the page
  useEffect(() => {
    getUser();
  }, []);

  const handleCancel = (item) => {
    //Accept current user
   firestore().collection('UserInfo').doc(auth().currentUser.uid)
   .collection('OrderSent').doc(item.ServicerUID)
   .update({
    Status: 'Canceled'
   });
   //Accept target user
   firestore().collection('UserInfo').doc(item.ServicerUID)
   .collection('OrderReceived').doc(auth().currentUser.uid)
   .update({
    Status: 'Canceled'
   });
   //Sends notifcation
   firestore()
   .collection('UserInfo')
   //.where('userId', '==',user.uid)
   .doc(item.ServicerUID)
   .collection('notifications')
   .add({
     title: item.Servicer,
     body: 'Customer cancels your work order!',
     createdAt: new Date().getTime(),
   });
  };
  const handleClear = (item) => {
    //Accept current user
   firestore().collection('UserInfo').doc(auth().currentUser.uid)
   .collection('OrderSent').doc(item.ServicerUID)
   .delete()
   .then(() => {console.log('Job Deleted')});

  };
  const handleReview = (item) => {
    navigation.navigate('ReviewPage',{id: item.ServicerUID})

  };
  return (
    <View>
    <View>
      <Text style={styles.header}>Order Sent</Text>
      <FlatList
         style={{height: '91.1%'}}
        data={userInfo}
        renderItem={({item}) => {
          let statusComponent = null;
          if (item.Status === 'Sent') {
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
                    Request Sent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
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
          } else if (item.Status === 'Accepted') {
            statusComponent = (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <Text style={{color: 'red', marginRight: 10}}>Accepted</Text> */}
                <TouchableOpacity
                  style={styles.button2}
                 >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    In Progress
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
                  style={styles.button}
                  onPress={() => handleReview(item)}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'white',
                      textAlign: 'center',
                    }}>
                    Leave Review
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
                  <Text style={styles.text}>{item.Servicer}</Text>
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
                    <Text style={styles.text}>Job is now in progress</Text>
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
}

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
});
export default RequestOrderPage