import { View, Text, Button, ScrollView , FlatList,  ActivityIndicator, Image, TouchableWithoutFeedback, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'

import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PermissionsAndroid, Platform } from "react-native";
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PictureSelectPage = ({navigation}) => {

   //-----------FireBase and FireStore START-----------------
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState('');
  //Saves UserInfo FIRESTORE data here. 
  const [userInfo, setUserInfo] = useState(['']);
  const [imageUrl, setImageUrl] = useState(undefined); //for profile pic

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  //Return active user
  useEffect(() => {
    try {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    const subscriberinfo = firestore().collection('UserInfo').doc(auth().currentUser.uid)
    .onSnapshot(documentSnapshot => {
      setUserInfo(documentSnapshot.data())//Saves FIRESTORE data into UserInfo via setUserInfo
      console.log('Thehome: ',documentSnapshot.data()); //Show data in the log
    })
    return subscriber,subscriberinfo; // unsubscribe on unmount
  }
  catch{console.log("Catch")}
  }, []);
  //---------------FireBase and Firestore END------------------

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  //const [userid, copyuserid] = ('');

  useEffect(() => { 
    requestCameraRollPermission(); //run android permission function
    loadPhotos();
  }, []);

  //-----------------android permissions----------------
  async function requestCameraRollPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'App Permission',
          message: 'App needs access to your camera roll.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera roll permission granted.');
      } else {
        console.log('Camera roll permission denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  //----------------android permission end---------------

  const loadPhotos = () => {
    console.log('Enter loadphotos');
    setLoading(true);
    CameraRoll.getPhotos({ first: 50 })
      .then(res => {
        setPhotos(res.edges);
        setLoading(false);
        console.log('inside then');
      })
      .catch(err => console.error(err));
  };

  const uploadPhoto = async() => {

    userid = auth().currentUser.uid;
    const reference = storage().ref("profile" +userid);
    
    const pathToFile = selectedPhoto.node.image.uri;
    console.log('Uploading photo to Firebase Storage...');
    reference.putFile(pathToFile).then(() => {
      console.log('Creating URL for profile pic...');
      storage()
      .ref("profile"+userid) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
      })
      .catch( console.log('Error trying to get profile pic to storage'));

      console.log('Saving in storage');
      if (!imageUrl)
      {
        console.log('There no image, Please try again');
       
      }
      else{
        firestore()
        .collection('UserInfo')
        .doc(auth().currentUser.uid)
        .update({profilePic: imageUrl})
        console.log('Photo upload successful!');
        Alert.alert('Image Uploaded Successfully','',[{text: 'Okay', onPress: NavigateBack}]);
        //navigation.nagivate('ProfilePage');
      }

    }).catch((error) => {
      console.error('Error uploading photo: ', error);
    });
  };
const NavigateBack = () => {
  navigation.navigate('EditProfilePage');
}
  const handleSelectPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleUploadPhoto = () => {
    if (selectedPhoto) {
      uploadPhoto();
    }
  };

  return (
    <View>
      {/* <Button title="Select Photo" onPress={() => launchImageLibrary({}, handleSelectPhoto)} /> */}
      <Button title="Upload Photo" onPress={handleUploadPhoto} disabled={!selectedPhoto}  />
      <ScrollView>
      </ScrollView>
      <View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={photos}
            numColumns={3}
            keyExtractor={item => item.node.image.uri}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => handleSelectPhoto(item)}>
                <Image
                  style={{ width: '33.3%', height: 120 }}
                  source={{ uri: item.node.image.uri }}
                  //onLoadStart={() => console.log('Image loading started.')}
                  //onLoadEnd={() => console.log('Image loading finished.')}
                  //onError={() => console.log('Error loading image.')}
                />
              </TouchableWithoutFeedback>
            )}
          />
        )}
      </View>
    </View>
  )
}

export default PictureSelectPage
