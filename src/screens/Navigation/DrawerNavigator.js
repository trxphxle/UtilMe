import React, { useEffect, useState } from 'react'
import {View, TouchableOpacity, Alert, Image, Text, ImageBackground, StyleSheet} from 'react-native';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ContactStackNavigator} from './StackNavigator';
import TabNavigator from './TabNavigator';
import OrderTabNavigator from "./OrderTabNavigator";
import auth from '@react-native-firebase/auth';
//import ProfilePage from "../ProfilePage"
import {
  ProfilePageNavigator,
  NotificationPageNavigator,
  SettingsPageNavigator,
  OrderHistoryPageNavigator,
  ContactSupportPageNavigator,
} from './StackNavigator';
import firestore from '@react-native-firebase/firestore';
import background from '../../../assets/images/Background10.png'

const Drawer = createDrawerNavigator();

const DrawerNavigator = navigation => {
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
      console.log('Thehome: ',documentSnapshot.data()); //Show data in the log
    })
    return subscriber,subscriberinfo; // unsubscribe on unmount
  }
  catch{console.log("Catch")}
  }, []);
  //---------------FireBase and Firestore END------------------
  function Logout() {
    Alert.alert(
      'Are you sure you wanna Log Out?',
      'You will have to log in again',
      [
        //these will gives us our options
        {text: 'Log Out', onPress: SignOff}, //figure out how to go back to the homepage if log out button is pressed
        {text: 'Exit', onPress: () => console.log('User has changed her mind')},
      ],
    );
  }
  const SignOff = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };
  return (
    <Drawer.Navigator
      screenOptions={{
        showIcon: true,
        showLabel: false,
        drawerItemStyle: {
          color: 'red',
        },
      }}
      initialRouteName="Home"
      drawerContent={props => {
        return (
          <DrawerContentScrollView {...props}>
            <View>
            <ImageBackground source={background}  style={styles.image} >
            <Image
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                marginLeft: 35,
                marginTop: 10,
                marginBottom: 10,
              }}
              source={{uri: userInfo.profilePic}}
            />
            <Text style={{marginLeft: 48,marginBottom: 30, color: 'white', fontSize: 25, fontWeight: 'bold',}}>{userInfo.Name}</Text>
            </ImageBackground>
            </View>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Log Out"
              onPress={Logout}
              labelStyle={{color: 'white', marginTop: 0, marginLeft: 0}}
              icon={({color, size}) => (
                <FontAwesome5 name="sign-out-alt" size={20} color={'white'} />
              )}
              style={{
                marginTop: 180,
                marginLeft: 10,
                backgroundColor: '#ff9666',
                borderRadius: 25,
              }}
            />
          </DrawerContentScrollView>
        );
      }}>
      <Drawer.Screen
        name="Home "
        component={TabNavigator}
        options={{
          headerShown: true,
          headerTitle: ' ',
          headerTransparent: true,
          headerTintColor: 'white',
          drawerLabelStyle: {color: 'white'},

          drawerStyle: {
            borderTopRightRadius: 17,
            borderBottomRightRadius: 17,
            backgroundColor: '#50555C',
          },
          drawerItemStyle: {
            backgroundColor: 'transparent',
          },
          headerTitleStyle: {
            backgroundColor: 'transparent',
          },
          drawerIcon: ({color}) => {
            return (
              <View>
                <FontAwesome5 name={'home'} size={20} color={'white'} />
              </View>
            );
          },
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfilePageNavigator}
        options={{
          headerShown: true,
          headerTitle: 'Profile',
          headerTransparent: false,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#464646',
          },
          drawerLabelStyle: {color: 'white'},
          drawerStyle: {
            borderTopRightRadius: 17,
            borderBottomRightRadius: 17,
            backgroundColor: '#50555C',
          },
          drawerItemStyle: {
            backgroundColor: 'transparent',
          },
          headerTitleStyle: {
            backgroundColor: 'transparent',
          },
          drawerIcon: ({color}) => {
            return (
              <View>
                <FontAwesome5 name={'user-alt'} size={20} color={'white'} />
              </View>
            );
          },
        }}
      />

      <Drawer.Screen
        name="Notification"
        component={NotificationPageNavigator}
        options={{
          headerShown: true,
          headerTitle: 'Notification',
          headerTransparent: false,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#464646',
          },
          drawerLabelStyle: {color: 'white'},
          drawerStyle: {
            borderTopRightRadius: 17,
            borderBottomRightRadius: 17,
            backgroundColor: '#50555C',
          },
          drawerItemStyle: {
            backgroundColor: 'transparent',
          },
          headerTitleStyle: {
            backgroundColor: 'transparent',
          },
          drawerIcon: ({color}) => {
            return (
              <View>
                <FontAwesome5 name={'bell'} size={20} color={'white'} />
              </View>
            );
          },
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsPageNavigator}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerTransparent: false,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#464646',
          },
          drawerLabelStyle: {color: 'white'},
          drawerStyle: {
            borderTopRightRadius: 17,
            borderBottomRightRadius: 17,
            backgroundColor: '#50555C',
          },
          drawerItemStyle: {
            backgroundColor: 'transparent',
          },
          headerTitleStyle: {
            backgroundColor: 'transparent',
          },
          drawerIcon: ({color}) => {
            return (
              <View>
                <FontAwesome5 name={'cog'} size={20} color={'white'} />
              </View>
            );
          },
        }}
      />

      <Drawer.Screen
        name="Order History"
        component={OrderTabNavigator}
        options={{
          headerShown: true,
          headerTitle: 'Order History',
          headerTransparent: false,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#464646',
          },
          drawerLabelStyle: {color: 'white'},
          drawerStyle: {
            borderTopRightRadius: 17,
            borderBottomRightRadius: 17,
            backgroundColor: '#50555C',
          },
          drawerItemStyle: {
            backgroundColor: 'transparent',
          },
          headerTitleStyle: {
            backgroundColor: 'transparent',
          },
          drawerIcon: ({color}) => {
            return (
              <View>
                <FontAwesome5 name={'archive'} size={20} color={'white'} />
              </View>
            );
          },
        }}
      />

      <Drawer.Screen
        name="Contact Support"
        component={ContactSupportPageNavigator}
        options={{
          headerShown: true,
          headerTitle: 'Contact Support',
          headerTransparent: false,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#464646',
          },
          drawerLabelStyle: {color: 'white'},
          drawerStyle: {
            borderTopRightRadius: 17,
            borderBottomRightRadius: 17,
            backgroundColor: '#50555C',
          },
          drawerItemStyle: {
            backgroundColor: 'transparent',
          },
          headerTitleStyle: {
            backgroundColor: 'transparent',
          },
          drawerIcon: ({color}) => {
            return (
              <View>
                <FontAwesome5 name={'envelope'} size={20} color={'white'} />
              </View>
            );
          },
        }}
      />

      {/* <DrawerItem label= 'Log Out' onPress={Logout}/> */}
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({
  image: {
    flex: 1,
    marginTop: 10,
    
    //justifyContent: 'center',
    //position: 'absolute'
  }
})
export default DrawerNavigator;
