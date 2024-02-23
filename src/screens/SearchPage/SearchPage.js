import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Button,
  ImageBackground,
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import React, {useEffect, useState} from 'react';
//Firebase imports
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import background from '../../../assets/images/Background7.png';
import CustomButton from '../../components/CustomButton/Button';


const SearchPage = ({navigation}) => {
  const [searchword]= useState("");
  const [search, setSearch] = useState('');
  const [userInfo, setUserInfo] = useState([]);
  const subscriberinfo = firestore().collection('UserInfo');

  const [TargetName, setTargetName] = useState('');
  const [TargetUID, setTargetUID] = useState('');
  const [PPic, setProfilePic] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  

  useEffect(() => {
    try{
    subscriberinfo.onSnapshot(querySnapShot => {
      const userInfo = [];
      
      querySnapShot.forEach(doc => {
        
        const {Name} = doc.data();
        const {profilePic} = doc.data();
        userInfo.push({
          Name,
          id: doc.id,
          profilePic
        });
        
      });
      setUserInfo(userInfo); //Saves FIRESTORE data into UserInfo via setUserInfo



    });
    //Show data in the log

  }
  catch{console.log("error catch in search page")}
}
  , []);

  updateSearch = search => {
    this.setState({search});
  };


  const AddFavorite = async () => {
    console.log('Enter AddFavorite');
    if (TargetName == '')
    {
      console.log("Error there is no target name")
    }
    else{
      firestore()
      .collection('UserInfo')
      //.where('userId', '==',user.uid)
      .doc(auth().currentUser.uid)
      .collection('favUser')
      .doc(TargetUID)
      .set({
        Name: TargetName,
        profilePic: PPic,
      })
      .then(() => {
        console.log('User added!!!');
        //navigation.navigate("HomePage")
      })
      .catch(error => alert(error.message));
    }

  };
  const filteredUsers = userInfo.filter(userInfo => {
    return userInfo.Name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = text => {
    setSearchTerm(text);
  };
  return (
    <View>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={styles.image}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={handleSearch}
          value={searchTerm}
          onSubmitEditing={() => {}}
        />

         <CustomButton ButtonText="Map View"  onPressEvent={() =>navigation.navigate('MapPage')} />
        {/*<Text>Inside Search: {search}</Text>*/}
        <Text style={{fontWeight: 'bold', textAlign: 'center', color: 'black'}}>
          All Users:
        </Text>
        <FlatList
          style={{height: '100%'}}
          data={filteredUsers}
          numColumns={1}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
            <Pressable
              onPress={() =>
                navigation.navigate('TargetProfilePage', {id: item.id})
              }
              style={styles.container}>
              <View style={styles.innerContainer}>
              <Image style={{height: 50, width: 50, borderRadius: 100, }} source={{uri: item.profilePic}} />
                <Text style={styles.text}> {item.Name} </Text>
                {/*{setTargetName(item.Name)}*/}
                {/* {setTargetUID(item.id)}*/}
                <Button
                  title="Favorite+"
                  color="#FF9666"
                  onPress={() => {
                    setTargetName(item.Name),
                      setTargetUID(item.id),
                      setProfilePic(item.profilePic)
                      AddFavorite();
                  }}
                />
              </View>
            </Pressable>
            </View>
          )}
        />
      </ImageBackground>
      
       
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 15,
    borderRadius: 15,
    //margin: 5,
    //marginHorizontal: 10,
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
  itemContainer: {
    //padding: 10,
    //backgroundColor: "#FFF",
    margin: 5,
    marginHorizontal: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10,
  },
});

export default SearchPage;
