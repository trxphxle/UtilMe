import { View, Text, TextInput, StyleSheet, ImageBackground, Button,TouchableWithoutFeedback } from 'react-native'
import React,{ useState, useEffect} from 'react'
import CustomButton from '../../components/CustomButton/Button';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import background from '../../../assets/images/Background5.png'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fonts } from 'react-native-elements/dist/config';

const TheHome = ({navigation}) => {
  //-----------FireBase and FireStore START-----------------
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState('');
  //Saves UserInfo FIRESTORE data here. 
  const [userInfo, setUserInfo] = useState(['']);

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
     // console.log('Thehome: ',documentSnapshot.data()); //Show data in the log
    })
    return subscriber,subscriberinfo; // unsubscribe on unmount
  }
  catch{console.log("Catch")}
  }, []);

  const getDocumentCount = async () => {
    const querySnapshot = await firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .collection('notifications')
      .get();
    setDocumentCount(querySnapshot.size);
  };
  //When returning to the page. It run getDocumentCount function to update Notifications
  useFocusEffect(
    React.useCallback(() => {
      getDocumentCount();
    }, [])
  );

  
  //---------------FireBase and Firestore END------------------
  
//Count items in firebase
const [documentCount, setDocumentCount] = useState(0);

useEffect(() => {
  const getDocumentCount = async () => {
    const querySnapshot = await firestore()
      .collection('UserInfo')
      .doc(auth().currentUser.uid)
      .collection('notifications')
      .get();
    setDocumentCount(querySnapshot.size);
  };

  getDocumentCount();
}, []);



  if (initializing) return null;

  //Message when no user is logged in
  if (!user) {
    navigation.navigate('FrontPage'); //if no user is logged in. go to frontpage
    return (
      <View>
        <Text>No user found</Text>

      </View>
    );
  }
  else if(!userInfo){
    return (
      <View>
        <Text>No user found</Text>
      </View>
    );
  }
  //Message when user is Logged in
  return (
    <View style= {styles.container}>
            <ImageBackground source={background} resizeMode="cover" style={styles.image} >
        
          <Text style={styles.textfont}>Welcome</Text>
      
      <Text style={styles.namestyle}>{userInfo.Name}</Text>
      <Text style={styles.getstarted}>Get Started</Text>
      <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Notification')}>
      <View style={{flexDirection: 'row', marginTop: 15, marginLeft: 35}}>
      <MaterialIcons name={'announcement'} size={40} color={'orange'} > </MaterialIcons>
      <Text style={{fontSize: 20 ,marginTop: 4}}>New Notifications: {documentCount}</Text>
      </View>
      </TouchableWithoutFeedback>
      <View style={styles.CreateJob}>
            <CustomButton 
            ButtonText="Become a Servicer" 
            onPressEvent={() => navigation.navigate('ApplyServicer')}
            type="LEFT"
            />

        
      </View>
      <View style={styles.FindJob}>
      <CustomButton 
            ButtonText="Find Job Service" 
            onPressEvent={() => navigation.navigate('MapPage')}
            type="RIGHT"
            />
        </View>

      {/*<CustomButton ButtonText="Sign Out" onPressEvent={SignOff}/>*/}
      {/*<Text> Welcome {FirebaseAuthTypes.currentUser?.email}</Text>*/}
      {/*<TextInput placeholder= "Name:" value={name} onChangeText={(name) => {setName(name)}} />*/}
      {/*<CustomButton ButtonText="Update" onPressEvent={UpdateInfo}/>*/}
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    flex: 1, 
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#f2f2f2' 
  },
  textfont:{
    marginTop: 0,
    paddingLeft:20,
    fontWeight: 'bold',
    fontSize: 45,
    color: 'white',
  },
  namestyle:{
    //paddingLeft:50,
    fontWeight: 'bold',
    fontSize: 45,
    color: 'white',
    alignSelf: 'center'
  },
  getstarted:{
    marginTop: 80,
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
    fontFamily: 'Arial'
  },
  CreateJob:{
    marginTop: 80,
    
    //marginLeft: 20,
    marginRight: 80,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black'
  },
  FindJob:{
    marginTop: 40,
    marginLeft: 140,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black'
  },
  image: {
    flex: 1,
    //justifyContent: 'center',
    
  },
})

export default TheHome
