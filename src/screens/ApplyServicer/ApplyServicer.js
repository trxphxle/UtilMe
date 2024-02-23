import {View, Text, TextInput, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ApplyServicer = ({navigation}) => {
  const [job, setJob] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [userInfo, setUserInfo] = useState([]);

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
  };
  //1)Run this code when enter the page
  useEffect(() => {
    getUser();
  }, []);

  //3) Confirm information with Alert
  const handleCheck = () => {
    Alert.alert('Check', 'Is this information correct?', [
      {
        text: 'Yes',
        onPress: addServicer,
      },
      {text: 'No'},
    ]);
  };


  const handleCheck2 = () => {
    Alert.alert('Check', 'Are you sure you want to turn off Servicer Mode?', [
      {
        text: 'Yes',
        onPress: RemoveServicer,
      },
      {text: 'No'},
    ]);
  };
//4)Add Servicer info to firestore
  const addServicer = () => {
     firestore()
        .collection('UserInfo')
        .doc(auth().currentUser.uid)
        .update({
          //It allows me to edit the user info, while keeping its old information as well.
          job: job,
          Description: aboutMe,
          servicer: true,
        });
  
      console.log('User Info Updated!');
      navigation.navigate('TheHome');
    } 

    const RemoveServicer = () => {
      firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .update({
        servicer: false,
      });
    navigation.navigate('TheHome');
    }
    if(userInfo.servicer === true)
    {
      return (
        <View>
          <Text>You are a servicer</Text>
          <TouchableOpacity style={styles.button} onPress={handleCheck2}>
            <Text
              style={{fontWeight: 'bold', color: 'white', textAlign: 'center'}}>
              Unapply
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    else{

    
  return (
    <View>
      <TextInput
        style={styles.input1}
        placeholder={'Job Title'}
        placeholderTextColor={'gray'}
        maxLength={30}
        value={job}
        onChangeText={text => setJob(text)}
      />
      <TextInput
        style={styles.input2}
        placeholder={'About me Description'}
        placeholderTextColor={'gray'}
        multiline={true}
        numberOfLines={5}
        maxLength={400}
        value={aboutMe}
        onChangeText={text => setAboutMe(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleCheck}>
        <Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center'}}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
    }
};
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
export default ApplyServicer;
