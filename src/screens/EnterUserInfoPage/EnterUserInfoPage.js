import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import CustomButton from '../../components/CustomButton/Button';
import React, {useState, useEffect, useRef} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import background from '../../../assets/images/Background2.png';
import messaging from '@react-native-firebase/messaging';
import { CheckBox } from 'react-native-elements';
import Geocoding from 'react-native-geocoding';

import {async} from '@firebase/util';

const EnterUserInfoPage = ({navigation}) => {
  //gets current userID
  function getCurrentUserID() {
    try{
    const currentUser = auth().currentUser;
    const userID = currentUser.uid;
    return userID;
    }
    catch{}
  }

  React.useEffect(() => {
    Geocoding.init('AIzaSyBrGcfETqC9kI_vi5ATFvnSXAflHkNWNgc');
  }, []);

  //--------------------------servicer page---------------------------------------//
  const userServiceCollection = firestore()
    .collection('UserInfo')
    .doc(getCurrentUserID())
    .collection('Service');
  function initalServiceSetup() {
    const userService = {
      job: '',
      aboutMe: '',
      servicer: false,
    };
    try {
      userServiceCollection.add(userService);
      console.log('service uploaded to firestore');
    } catch (error) {
      console.log('error:', error);
    }
  }
  //--------------------------end of servicer page--------------------------------//
  //--------------------------NotificationPrefsetup-------------------------------//
  const userNotifPref = firestore()
    .collection('UserInfo')
    .doc(getCurrentUserID())
    .collection('NotificationPref');
  function initalNotificationPrefSetup() {
    const userPref = {
      receiveNotifications: true,
    };
    try {
      userNotifPref.add(userPref);
      console.log('notification pref uploaded to firestore');
    } catch (error) {
      console.log('error:', error);
    }
  }
  //----------------------------END-----------------------------------------------//
  //anything realated to getting token and storing in firestore
  //this fucntion will be used to get the token and pass it to another variable as a string
  async function GetToken() {
    const token = await messaging().getToken();
    return token;
  }
  //for this part ima leave out the authstatus
  //this stores the fcm token into the firestore
  async function storeFCMToken(userId, token) {
    await firestore().collection('UserInfo').doc(userId).update({
      fcmToken: token,
    });
  }
  /////////////////////////END///////////////////////////////////////////////
  //Pulls user info from firebase
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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

  //Variables
  const [name, setName] = useState('');
  const [Address1, setAddress1] = useState('');
  const [Address2, setAddress2] = useState('');
  const [City, setCity] = useState('');
  const [ZipCode, setZipCode] = useState('');
  const [PhoneNumber, setPB] = useState('');
  const [Description, setDescription] = useState('');
  const [checked, setChecked] = useState(false);
  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');
  

  const handleCheck2 = () => {
    setChecked(!checked);
  };

  //Refs
  const Address1Ref = useRef();
  const Address2Ref = useRef();
  const CityRef = useRef();
  const ZipCodeRef = useRef();
  const PhoneNumberRef = useRef();

  //Store infomation to firestore
  const UpdateInfo = async () => {
    //notification

    //Geocoding 
    const FullAddress = `${Address1} ${Address2}, ${City} ${ZipCode}`;
   
    const response = await Geocoding.from(FullAddress); 
   try {
      if (!response || !response.results || response.results.length === 0) {
        console.log('Location not found');
        return;
      }
      const {lat, lng} = response.results[0].geometry.location;
    

   
    await firestore()
      .collection('UserInfo')
      //.where('userId', '==',user.uid)
      .doc(auth().currentUser.uid)
      .set({
        Name: name,
        Address1: Address1,
        Address2: Address2,
        City: City,
        ZipCode: ZipCode,
        PhoneNumber: PhoneNumber,
        Description: Description,
        profilePic:
          'https://firebasestorage.googleapis.com/v0/b/utilme-auth.appspot.com/o/defaultprofilepic.png?alt=media&token=80641bad-985f-4742-a51f-e55d892e1b60',
          latitude: lat,
          longitude: lng,
          receiveNotifications: true,
          Description: " ",
          servicer: false,
          job: "",
          receiveNotifications: true,
          


      })
      .then(() => {
        console.log('User added!!!');
        console.log('What is inside lat2 and lng2: '+latitude +" space" +longitude)

        //this delay the action until the account is created in the firestore
        setTimeout(async () => {
          //we try to do everything here
          try {
            //get userID and token and stores it in the firestore
            const uid = getCurrentUserID();
            const token = await GetToken();
            await storeFCMToken(uid, token);
            console.log('stored fcm in firebase');
            //if there is an error this should let us know what happened
          } catch (error) {
            console.log('error:', error);
          }

          initalServiceSetup();
          initalNotificationPrefSetup();
          //this is how long we wait till the action happens
        }, 1000);

        //wer can def put it here cause this is where code is sent to add okay
        navigation.navigate('HomePage');
      })
      .catch(error => alert(error.message));
    }
    catch (error) {
      console.log(error);
    }
  };
  //Check if input is empty. If so then show alert message
  const handleCheck = () => {
    if (name.trim().length == 0) {
      alert('Please enter your name');
    } else if (Address1.trim().length == 0) {
      alert('Please enter your address');
    } else if (City.trim().length == 0) {
      alert('Please enter your City');
    } else if (ZipCode.trim().length == 0) {
      alert('Please enter your Zip Code');
    } else if (PhoneNumber.trim().length == 0) {
      alert('Please enter your Phone Number');
    } else {
      Alert.alert('Check', 'Is this information correct?', [
        {
          text: 'Yes',
          onPress: UpdateInfo,
          
        },
        {text: 'No'},
      ]);
    }
  };

  return (
    <View
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}>
      <View style={styles.root}>
        <ImageBackground
          source={background}
          resizeMode="cover"
          style={styles.image}>
          <Text style={{paddingTop: 10}}></Text>
          <Text
            style={{
              alignItems: 'center',
              color: 'white',
              fontSize: 40,
              fontWeight: 'bold',
              paddingLeft: 50,
            }}>
            Enter your information
          </Text>

          <View style={styles.input}>
            <TextInput
              placeholder="Name:"
              returnKeyType="next"
              onSubmitEditing={() => {
                Address1Ref.current.focus();
              }}
              blurOnSubmit={false}
              value={name}
              onChangeText={name => {
                setName(name);
              }}
            />
          </View>

          <View style={styles.input}>
            <TextInput
              placeholder="Address 1:"
              ref={Address1Ref}
              returnKeyType="next"
              onSubmitEditing={() => {
                Address2Ref.current.focus();
              }}
              blurOnSubmit={false}
              value={Address1}
              onChangeText={Address1 => {
                setAddress1(Address1);
              }}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              placeholder="Address 2: (Optional)"
              ref={Address2Ref}
              returnKeyType="next"
              onSubmitEditing={() => {
                CityRef.current.focus();
              }}
              blurOnSubmit={false}
              value={Address2}
              onChangeText={Address2 => {
                setAddress2(Address2);
              }}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              placeholder="City:"
              ref={CityRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                ZipCodeRef.current.focus();
              }}
              blurOnSubmit={false}
              value={City}
              onChangeText={City => {
                setCity(City);
              }}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              placeholder="Zip Code"
              ref={ZipCodeRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                PhoneNumberRef.current.focus();
              }}
              blurOnSubmit={false}
              value={ZipCode}
              onChangeText={ZipCode => {
                setZipCode(ZipCode);
              }}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              placeholder="Phone Number"
              ref={PhoneNumberRef}
              value={PhoneNumber}
              onChangeText={PhoneNumber => {
                setPB(PhoneNumber);
              }}
              returnKeyType="done"
              onSubmitEditing={handleCheck}
            />
          </View>
          <View >
          <CheckBox
      title='I Agree and Understand the Terms and Conditions'
      checked={checked}
      onPress={handleCheck2}
      containerStyle={{ backgroundColor: 'transparent' }}
    />

            
          </View>

          <View style={styles.buttonstyle}>
            <CustomButton
              ButtonText="Complete Sign Up"
              onPressEvent={handleCheck}
            />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F1F1F1',
  },
  input: {
    backgroundColor: 'white',
    width: '80%',
    margin: 30,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 30,

    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonstyle: {
    width: '110%',
    margin: 28,
    paddingTop: 20,
  },
  AgreeStyle: {
    paddingTop: 20,
    paddingLeft: 40,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default EnterUserInfoPage;
