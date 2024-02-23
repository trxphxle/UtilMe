import {View, Text, TextInput, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const RequestServicePage = ({navigation}) => {
  const [Subject, setSubject] = useState(''); //Subject from job order
  const [Joborder, setJoborder] = useState('');//Job order discription
  const [userInfo, setUserInfo] = useState([]);//Set Current user info
  const [userInfo2, setUserInfo2] = useState([]);//Set Target User info
  //Bring Target UserID from previous page
  const route = useRoute();
  const TargetID = route.params?.id; //target userid

  //2)Get UserInfo from currently log in user
  const getUser = async () => {
    //get user info
    await firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserInfo(documentSnapshot.data());
        }
      });
      //get target user info
      await firestore()
      .collection('UserInfo')
      .doc(TargetID)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserInfo2(documentSnapshot.data());
        }
      });
  };
  //1)Run this code when enter the page
  useEffect(() => {
    getUser();
  }, []);


//When you push submit
  const handleCheck = () => {
    Alert.alert('Check', 'Is this information correct?', [
      {
        text: 'Yes',
        onPress: addJobOrder,
      },
      {text: 'No'},
    ]);
  }
  const addJobOrder = () => {
    //Current user
    firestore()
    .collection('UserInfo')
    .doc(auth().currentUser.uid)
    .collection('OrderSent')
    .doc(TargetID)
    .set({
      Servicer: userInfo2.Name,
      ServicerUID: TargetID,
      profilePic: userInfo2.profilePic,
      Joborder: Joborder,
      Subject: Subject,
      Status: "Sent"
    })
    .then(() => {
      console.log('doc added to current user')
    })
    .catch(error =>  console.log("error sending doc data to current user"));
    //Send user notifications
    firestore()
    .collection('UserInfo')
    //.where('userId', '==',user.uid)
    .doc(TargetID)
    .collection('notifications')
    .add({
      title: userInfo2.Name,
      body: 'Requests your service!',
      createdAt: new Date().getTime(),
    });
    //Target user
    firestore()
    .collection('UserInfo')
    .doc(TargetID)
    .collection('OrderReceived')
    .doc(auth().currentUser.uid)
    .set({
      Client: userInfo.Name,
      ClientUID: auth().currentUser.uid,
      profilePic: userInfo.profilePic,
      Joborder: Joborder,
      Subject: Subject,
      Status: "Sent"
    })
    .then(() => {
      console.log('doc added to target user')
    })
    .catch(error =>  console.log("error sending doc data to target user"));
    
    navigation.navigate('TheHome');
  }
  return (
    <View>
      {/* <Text>RequestServicePage</Text> */}
      <TextInput
        style={styles.input1}
        placeholder={'Enter Subject'}
        placeholderTextColor={'gray'}
        maxLength={30}
        value={Subject}
        onChangeText={text => setSubject(text)}
      />
        <TextInput
        style={styles.input2}
        placeholder={'Enter your Job Request'}
        placeholderTextColor={'gray'}
        multiline={true}
        numberOfLines={5}
        maxLength={400}
        value={Joborder}
        onChangeText={text => setJoborder(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleCheck}>
        <Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center'}}>
          Submit
        </Text>
      </TouchableOpacity>
      <View>
        {/* <Text>{userInfo2.Name}</Text>
        <Text>{userInfo2.profilePic}</Text>
        <Text>{userInfo.Name}</Text>
        <Text>{auth().currentUser.uid}</Text>
        <Text>{Subject}</Text> */}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  input1:{
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: 18,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 25,
  },
  input2:{
    backgroundColor: 'white',
    borderRadius: 30,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 18,
    paddingLeft: 25,
    paddingTop: 20,
    textAlignVertical: 'top',
  },
  button:{
    backgroundColor: '#FF9666',
    borderRadius: 40,
    marginTop: 50,
    marginLeft: 100,
    marginRight: 100,
    height: 45,
    padding: 13,
  },
})
export default RequestServicePage