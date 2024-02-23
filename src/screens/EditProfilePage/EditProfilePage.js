import {
  View,
  Text,
  Alert,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomButton from '../../components/CustomButton/Button';
import Geocoding from 'react-native-geocoding';

const EditProfilePage = ({navigation}) => {
  const [userInfo, setUserInfo] = useState([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZC] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [description, setDescription] = useState('');
 // const [latitude, setlatitude] = useState('');
  //const [longitude, setlongitude] = useState('');

  React.useEffect(() => {
    Geocoding.init('AIzaSyBrGcfETqC9kI_vi5ATFvnSXAflHkNWNgc');
  }, []);


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
  useEffect(() => {
    getUser();
  }, []);

  const UpdateInfo = async () => {
    //Geocoding 
    const Taddress =   address || userInfo.Address1;
    const Taddress2 = address2 || userInfo.Address2;
    const Tcity = city || userInfo.City;
    const Tzipcode = zipcode || userInfo.ZipCode;
    const FullAddress = `${Taddress} ${Taddress2}, ${Tcity} ${Tzipcode}`;
   
  
    try {
      const response = await Geocoding.from(FullAddress);
      if (!response || !response.results || response.results.length === 0) {
        console.log('Location not found');
        return;
      }
      const {lat, lng} = response.results[0].geometry.location;
      //console.log('What is inside lat and lng: '+lat +" space" +lng)
      //setlatitude(lat);
      //setlongitude(lng);
  
     // console.log('What is inside lat and lng after state update: '+latitude +" space" +longitude);
  
      await firestore()
        .collection('UserInfo')
        .doc(auth().currentUser.uid)
        .update({
          //It allows me to edit the user info, while keeping its old information as well.
          Name: name || userInfo.Name,
          City: city || userInfo.City,
          ZipCode: zipcode || userInfo.ZipCode,
          Address1: address || userInfo.Address1,
          Address2: address2 || userInfo.Address2,
          Description: description || userInfo.Description,
          PhoneNumber: phonenumber || userInfo.PhoneNumber,
          latitude: lat || userInfo.latitude,
          longitude: lng || userInfo.longitude
        });
  
      console.log('User Info Updated!');
      navigation.navigate('ProfilePage');
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = () => {
    Alert.alert('Check', 'Is this information correct?', [
      {
        text: 'Yes',
        onPress: UpdateInfo,
      },
      {text: 'No'},
    ]);
  };

  return (
    //Note 1: Right now, still trynna figure out how to display the previous data while allowing user to change and update new info
    //Note 2: Users retrieve info when clicking edit, and even if they do not update anything the old info remains
    <View style={styles.all}>
      <ScrollView>
        <View style={{marginLeft: 120, paddingTop: 0}}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('PictureSelectPage')}>
            <View style={{position: 'relative'}}>
              <Image
                style={{height: 150, width: 150, borderRadius: 100}}
                source={{uri: userInfo.profilePic}}
              />
              <Text
                style={{
                  position: 'absolute',
                  top: 50,
                  left: 55,
                  color: 'white',
                  fontSize: 20,
                  textShadowColor: 'black',
                  textShadowOffset: {width: 1, height: 1},
                  textShadowRadius: 2,
                }}>
                Edit
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text style={styles.text}>Profile Information</Text>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
          <FontAwesome5.Button
            style={{paddingVertical: 0}}
            backgroundColor="white"
            borderRadius={20}>
            <TextInput
              placeholder="Name:"
              value={name !== '' ? name : userInfo.Name}
              onChangeText={value => setName(value !== '' ? value : null)}
            />
          </FontAwesome5.Button>
        </View>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
          <FontAwesome5.Button
            style={{paddingVertical: 0}}
            backgroundColor="white"
            borderRadius={20}>
            <TextInput
              placeholder="City:"
              value={city !== '' ? city : userInfo.City}
              onChangeText={value => setCity(value !== '' ? value : null)}
            />
          </FontAwesome5.Button>
        </View>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
          <FontAwesome5.Button
            style={{paddingVertical: 0}}
            backgroundColor="white"
            borderRadius={20}>
            <TextInput
              placeholder="Zip Code:"
              value={zipcode !== '' ? zipcode : userInfo.ZipCode}
              onChangeText={value => setZC(value !== '' ? value : null)}
            />
          </FontAwesome5.Button>
        </View>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
          <FontAwesome5.Button
            style={{paddingVertical: 0}}
            backgroundColor="white"
            borderRadius={20}>
            <TextInput
              placeholder="Address:"
              value={address !== '' ? address : userInfo.Address1}
              onChangeText={value => setAddress(value !== '' ? value : null)}
            />
          </FontAwesome5.Button>
        </View>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
          <FontAwesome5.Button
            style={{paddingVertical: 0}}
            backgroundColor="white"
            borderRadius={20}>
            <TextInput
              placeholder="Address2:"
              value={address2 !== '' ? address2 : userInfo.Address2}
              onChangeText={value => setAddress2(value !== '' ? value : null)}
            />
          </FontAwesome5.Button>
        </View>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
          <FontAwesome5.Button
            style={{paddingVertical: 0}}
            backgroundColor="white"
            borderRadius={20}>
            <TextInput
              placeholder="Phone Number:"
              value={phonenumber !== '' ? phonenumber : userInfo.PhoneNumber}
              onChangeText={value => setphonenumber(value !== '' ? value : null)}
            />
          </FontAwesome5.Button>
        </View>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 0}}>
          <Text style={styles.text}>About me</Text>
          <FontAwesome5.Button
            style={{  backgroundColor: 'white',
            borderRadius: 30,
            marginRight: 20,
            textAlignVertical: 'top',}}
            backgroundColor="white"
            borderRadius={20}
            >
            <TextInput
            style={{textAlignVertical: 'top',}}
              placeholder="Add A Description:"
              value={description !== '' ? description : userInfo.Description}
              onChangeText={value => setDescription(value !== '' ? value : null)}
              numberOfLines={5}
              maxLength={400}
              multiline={true}
            />
          </FontAwesome5.Button>
        </View>
        <Text style={{paddingTop: 0}}></Text>
        <View
          style={{
            paddingTop: 0,
            paddingLeft: 50,
            width: '85%',
            alignItems: 'center',
          }}>
          <CustomButton
            onPressEvent={handleCheck}
            ButtonText="Update User Information"
          />
          {/* <CustomButton 
       ButtonText="Upload Picture"
       onPressEvent={() =>navigation.navigate('PictureSelectPage')} />  */}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  all: {
    //marginTop:10,
    paddingLeft: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#161616',
    marginBottom: 15,
  },
  BubbleWord: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#161616',
  },
});
export default EditProfilePage;
