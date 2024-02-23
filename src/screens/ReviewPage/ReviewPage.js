import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const ContactSupportPage = ({navigation}) => {
  const [userInfo, setUserInfo] = useState([]);
  const [name, setName] = useState('');
  const [reviews, setReview] = useState('');
  const [explanation, setExplanation] = useState('');
  const route = useRoute();
  const userId = route.params?.id;
  function getCurrentUserID() {
    const currentUser = auth().currentUser;
    const userID = currentUser.uid;
    return userID;
  }
  useEffect(() => {
    const subscriberinfo = firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .onSnapshot(documentSnapshot => {
        setUserInfo(documentSnapshot.data()); //Saves FIRESTORE data into UserInfo via setUserInfo
       // console.log('Thehome: ', documentSnapshot.data()); //Show data in the log

        // //profile pic
        // userid = auth().currentUser.uid;
        // storage()
        //   .ref('defaultprofilepic.jpg') //name in storage in firebase console
        //   .getDownloadURL()
        //   .then(url => {
        //     setImageUrl(url);
        //   })
        //   .catch(
        //     storage()
        //       .ref('defaultprofilepic') //if no pic found. use defaultprofilepic
        //       .getDownloadURL()
        //       .then(url => {
        //         setImageUrl(url);
        //       }),
        //   );
        //   console.log("this is uri: ", imageUrl)
        // //end of profile pic
      });
    return subscriberinfo; // unsubscribe on unmount
  }, []);
  const userID = getCurrentUserID();
  const addReview = async () => {
    firestore()
    .collection('UserInfo')
    //.where('userId', '==',user.uid)
    .doc(userId)
    .collection('notifications')
    .doc(userID)
    .set({
      title: userInfo.Name,
      body: 'Submits a review to your page!',
      createdAt: new Date().getTime(),
    })
    .then(() => {
      console.log('User added!!!');
      //navigation.navigate("HomePage")
    })
    .catch(error => alert(error.message));
  }
  //will create a new collection for a new the user using
  const userIssuesCollection = firestore()
    .collection('UserInfo')
    .doc(userId)
    .collection('Review')
    .doc(auth().currentUser.uid);

  const addNewIssue = async () => {
      firestore()
      .collection('UserInfo')
      //.where('userId', '==',user.uid)
      .doc(userId)
      .collection('Review')
      .doc(userID)
      .set({
        Name: userInfo.Name,
        url: userInfo.profilePic,
        reviews,
        explanation,
      })
      .then(() => {
        addReview();
        console.log('User added!!!');
        navigation.navigate('TargetProfilePage');
        //navigation.navigate("HomePage")
      })
      .catch(error => alert(error.message));
    }
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
        value={userInfo.Name}
        onChangeText={text => setName(text)}
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
        placeholder={'Please explain your experience with the servicer'}
        placeholderTextColor={'gray'}
        multiline={true}
        numberOfLines={5}
        maxLength={400}
        value={reviews}
        onChangeText={text => setReview(text)}
      />
      {/* <TextInput
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
        placeholder={'Please explain your experience with the servicer'}
        placeholderTextColor={'gray'}
        multiline={true}
        numberOfLines={5}
        maxLength={400}
        value={explanation}
        onChangeText={text => setExplanation(text)}
      /> */}
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
        onPress={() => {addNewIssue();}}>
        <Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center'}}>
          Submit for Review
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactSupportPage;
