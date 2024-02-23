import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ContactSupportPage = () => {
  const [name, setName] = useState('');
  const [issue, setIssue] = useState('');
  const [explanation, setExplanation] = useState('');
  const [email, setEmail] = useState('');
  function getCurrentUserID() {
    const currentUser = auth().currentUser;
    const userID = currentUser.uid;
    return userID;
  }

  const userID = getCurrentUserID();

  //will create a new collection for a new the user using
  const userIssuesCollection = firestore()
    .collection('UserInfo')
    .doc(userID)
    .collection('Issues');

  const addNewIssue = () => {
    const userIssues = {
      name,
      issue,
      explanation,
      email,
      createdAt: new Date().getTime(),
    };
    try {
      userIssuesCollection.add(userIssues);
      console.log('issue succesfuly uploaded to firestore');
      setName('');
      setIssue('');
      setExplanation('');
      setEmail('');
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <View>
      <TextInput
        style={{
          backgroundColor: 'white',
          borderRadius: 30,
          marginTop: 18,
          marginLeft: 20,
          marginRight: 20,
          paddingLeft: 25,
        }}
        placeholder={'Name'}
        placeholderTextColor={'gray'}
        maxLength={30}
        value={name}
        onChangeText={text => setName(text)}
      />
       <TextInput
          style={{
            backgroundColor: 'white',
            borderRadius: 30,
            marginTop: 18,
            marginLeft: 20,
            marginRight: 20,
            paddingLeft: 25,
          }}
        placeholder={'Email'}
        placeholderTextColor={'gray'}
        multiline={true}
        numberOfLines={2}
        maxLength={100}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={{
          backgroundColor: 'white',
          borderRadius: 30,
          marginTop: 18,
          marginLeft: 20,
          marginRight: 20,
          paddingLeft: 25,
        }}
        placeholder={'Issue'}
        placeholderTextColor={'gray'}
        multiline={true}
        numberOfLines={2}
        maxLength={100}
        value={issue}
        onChangeText={text => setIssue(text)}
      />
      <TextInput
        style={{
          backgroundColor: 'white',
          borderRadius: 30,
          marginLeft: 20,
          marginRight: 20,
          marginTop: 18,
          paddingLeft: 25,
          paddingTop: 20,
          textAlignVertical: 'top',
        }}
        placeholder={'Please Explain your issue here'}
        placeholderTextColor={'gray'}
        multiline={true}
        numberOfLines={5}
        maxLength={400}
        value={explanation}
        onChangeText={text => setExplanation(text)}
      />
     
      <TouchableOpacity
        style={{
          backgroundColor: '#FF9666',
          borderRadius: 40,
          marginTop: 50,
          marginLeft: 100,
          marginRight: 100,
          height: 45,
          padding: 13,
        }}
        onPress={addNewIssue}>
        <Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center'}}>
          Submit for Review
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactSupportPage;
