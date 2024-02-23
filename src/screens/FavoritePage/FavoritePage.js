import {
  View,
  Button,
  Text,
  Pressable,
  StyleSheet,
  TextStyle,
  FlatList,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import background from '../../../assets/images/Background8.png';

const FavoritePage = ({navigation}) => {
  const [userInfo, setUserInfo] = useState([]);
  const subscriberinfo = firestore()
    .collection('UserInfo')
    .doc(auth().currentUser.uid)
    .collection('favUser');
  const [TargetUID, setTargetUID] = useState('');

  const DeleteFavorite = async () => {
    firestore()
      .collection('UserInfo')
      //.where('userId', '==',user.uid)
      .doc(auth().currentUser.uid)
      .collection('favUser')
      .doc(TargetUID)
      .delete()
      .then(() => {
        console.log('Favorite User Deleted!');
        //navigation.navigate("HomePage")
      })
      .catch(error => alert(error.message));
  };

  //First get UserInfo/UserID/favUser and snapshot the document
  useEffect(() => {
    try{
    subscriberinfo.onSnapshot(querySnapShot => {
      const userInfo = [];
      //snapshot UserInfo/UserID/FavUser/Document atributes
      querySnapShot.forEach(doc => {
        const {Name} = doc.data();
        const {profilePic} = doc.data();
        userInfo.push({
          Name,
          id: doc.id,
          profilePic,
        });
      });
      setUserInfo(userInfo); //Saves FIRESTORE data into UserInfo via setUserInfo
    });
    //Show data in the log
  }catch{console.log("error catch in search page")}
  }, []);
  return (
    <View>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={styles.image}>
        <FlatList
          style={{height: '100%'}}
          data={userInfo}
          numColumns={1}
          renderItem={({item}) => (
            <Pressable
              onPress={() =>
                navigation.navigate('TargetProfilePage', {id: item.id})
              }
              style={styles.container}>
              <View style={styles.innerContainer}>
              <Image style={{height: 50, width: 50, borderRadius: 100, }} source={{uri: item.profilePic}} />
                <Text style={styles.text}> {item.Name} </Text>
                <Button
                  title="UnFavorite"
                  color="#FF9666"
                  onPress={() => {
                    setTargetUID(item.id), DeleteFavorite();
                  }}
                />
              </View>
            </Pressable>
          )}
        />
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    //flex: 1,
    justifyContent: 'center',
    //position: 'absolute'
  },
});
export default FavoritePage;
