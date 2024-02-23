import {
  View,
  Text,
  Alert,
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../../components/CustomButton/Button';
import background from '../../../assets/images/Background6.png';
import storage from '@react-native-firebase/storage';

// function UpdateEvent() {
//   Alert.alert(
//     'Would you like to update?',
//     [
//     //these will gives us our options
//     {text: 'Yes', onPress: () => console.log('User Updated Info')},//figure out how to go back to the homepage if log out button is pressed
//     {text: 'No', onPress: () => console.log('User Info Kept The Same')},
//     ]
//     );
// }
const ProfilePage = ({navigation}) => {
  const [userInfo, setUserInfo] = useState([]);
  const [imageUrl, setImageUrl] = useState(undefined); //for profile pic
  const [userInfo2, setUserInfo2] = useState([]);
  //const [name, setName] = useState('');

  const subscriberinfo2 = firestore()
  .collection('UserInfo')
  .doc(auth().currentUser.uid)
  .collection('Review');
  useEffect(() => {
    const subscriberinfo = firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .onSnapshot(documentSnapshot => {
        setUserInfo(documentSnapshot.data()); //Saves FIRESTORE data into UserInfo via setUserInfo
        //console.log('Thehome: ', documentSnapshot.data()); //Show data in the log

        try{
          //First get UserInfo/UserID/Review and snapshot the document
        subscriberinfo2.onSnapshot(querySnapShot => {
          const userInfo2 = [];
          //snapshot UserInfo/UserID/Review/Document atributes
          querySnapShot.forEach(doc => {
            const {Name} = doc.data();
            const {explanation} = doc.data();
            const {reviews} = doc.data();
            const {url}= doc.data();
           // console.log('What inside', profilePic);
            userInfo2.push({
              Name,
              id: doc.id,
              explanation,
              reviews,
              url,//profilepic
            });
          });
          setUserInfo2(userInfo2); //Saves FIRESTORE data into UserInfo via setUserInfo
        });
        //Show data in the log
        //console.log('inside userinfo2:',userInfo2);
      }catch{console.log("error catch in search page")}
      });
    return subscriberinfo; // unsubscribe on unmount
  }, []);
  if (!userInfo) {
    return (
      <View>
        <Text>No user found</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.all}>
        <ImageBackground
          source={background}
          resizeMode="stretch"
          style={styles.image}>
            <ScrollView>
          <View style={{marginLeft: 100, paddingTop: 5}}>
            <Image
              style={{height: 200, width: 200, borderRadius: 100}}
              source={{uri: userInfo.profilePic}}
            />
          </View>
          {/* <Text>testinggggggggggggggggg{GetProfilePic(userInfo.profilePic)}</Text> */}
          {/*Edit Button */}
          <View
            style={{width: '25%', marginLeft: 280, margin: 5, paddingTop: 0}}>
            <FontAwesome.Button
              style={{paddingVertical: 11}}
              name="pencil-square-o"
              color="white"
              backgroundColor="#FF9666"
              borderRadius={20}
              marginLeft={9}
              iconStyle={{color: 'white'}}
              onPress={() => navigation.navigate('EditProfilePage')}>
              Edit
            </FontAwesome.Button>
          </View>

          <Text style={styles.text}>Profile Information</Text>
          <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
            <FontAwesome5.Button
              style={{paddingVertical: 11}}
              backgroundColor="white"
              borderRadius={20}>
              <Text style={styles.BubbleWord}>Name: {userInfo.Name} </Text>
            </FontAwesome5.Button>
          </View>
          <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
            <FontAwesome5.Button
              style={{paddingVertical: 11}}
              backgroundColor="white"
              borderRadius={20}>
              <Text style={styles.BubbleWord}>City: {userInfo.City}</Text>
            </FontAwesome5.Button>
          </View>
          <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
            <FontAwesome5.Button
              style={{paddingVertical: 11}}
              backgroundColor="white"
              borderRadius={20}>
              <Text style={styles.BubbleWord}>
                Address: {userInfo.Address1}
              </Text>
            </FontAwesome5.Button>
          </View>
          <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
            <FontAwesome5.Button
              style={{paddingVertical: 11}}
              backgroundColor="white"
              borderRadius={20}>
              <Text style={styles.BubbleWord}>
                Address2: {userInfo.Address2}
              </Text>
            </FontAwesome5.Button>
          </View>
          <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
            <FontAwesome5.Button
              style={{paddingVertical: 11}}
              backgroundColor="white"
              borderRadius={20}>
              <Text style={styles.BubbleWord}>
                Zip Code: {userInfo.ZipCode}
              </Text>
            </FontAwesome5.Button>
          </View>
          <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
            <FontAwesome5.Button
              style={{paddingVertical: 11}}
              backgroundColor="white"
              borderRadius={20}>
              <Text style={styles.BubbleWord}>
                Phone Number: {userInfo.PhoneNumber}
              </Text>
            </FontAwesome5.Button>
          </View>
          <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
        <Text style={styles.text}>About Me</Text>
        <FontAwesome5.Button
          style={{paddingVertical: 11}}
          backgroundColor="white"
          borderRadius={20}>
          <Text style={styles.BubbleWord} >{userInfo.Description} </Text>
        </FontAwesome5.Button>
      </View>
      <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
        <Text style={styles.text}>My Reviews</Text>
      </View>
      <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5, flex: 1}}>
      <FlatList
          style={{height: '50%'}}
          data={userInfo2}
          numColumns={1}
          renderItem={({item}) => (
            
              <View style={styles.container}>
                <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <Image style={{height: 50, width: 50, borderRadius: 100, }} source={{uri: item.url}} />
                <View style={{marginTop: 10, marginLeft: 10}}>
                <Text style={styles.text2}>{item.Name} </Text>
                </View>
                </View>

                {/* <Text style={styles.text}>Subject: {item.explanation} </Text> */}
                <Text style={{marginLeft: 10, marginTop: 10}}> {item.reviews} </Text>
              </View>
           
          )}
        />
      </View>
      </ScrollView>
        </ImageBackground>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  all: {
    flex: 1,
    //backgroundColor: 'blue',
    //paddingTop: 50,
    //paddingLeft: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    paddingLeft: 10,
  },
  BubbleWord: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#161616',
  },
  image: {
    flex: 1,
    //position: 'absolute',
    //position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //justifyContent: 'center',
    //position: 'absolute'
  },
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 1,
  },
  text2: {
    fontFamily: 'Inter',
    fontSize: 15.5,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 15,
    textShadowColor: 'white',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
});
export default ProfilePage;
