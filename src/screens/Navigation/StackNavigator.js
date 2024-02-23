import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { screenOptionStyle} from "react-native"
import FrontPage from '../FrontPage';
import HomePage from '../HomePage';
import SignInScreen from '../SignInScreen';
import TheHome from "../TheHome"
import SearchPage from '../SearchPage'
import MapPage from "../MapPage";
import FavoritePage from "../FavoritePage";
import ProfilePage from "../ProfilePage";
import NotificationPage from "../NotificationPage";
import SettingsPage from "../SettingsPage";
import OrderHistoryPage from "../OrderHistoryPage";
import ContactSupportPage from "../ContactSupportPage";
import SignUpPage from "../SignUpPage";
import ForgotPasswordPage from "../ForgotPasswordPage";
import EnterUserInfoPage from "../EnterUserInfoPage";
import EditProfilePage from "../EditProfilePage";
import TargetProfilePage from "../TargetProfilePage";
import RequestServicePage from "../RequestServicePage";
import PictureSelectPage from "../PictureSelectPage.js/PictureSelectPage";
import Open from "../../components/Notifs/index"
import ApplyServicer from "../ApplyServicer/ApplyServicer";
import ReviewPage from "../ReviewPage/index"
import RequestOrderPage from "../RequestOrderPage"
 

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      {/*FrontPage Navigator*/}
      <Stack.Screen
        name="FrontPage"
        component={FrontPage}
        options={{title: 'Welcome', headerShown: false}}
      />

      {/*SignInScreen Navigator*/}
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{headerShown: false}}
      />

      {/*SignUpPage Navigator*/}
      <Stack.Screen
        name="SignUpPage"
        component={SignUpPage}
        options={{
          title: 'Sign Up',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {backgroundColor: '#464646'},
          headerTitleStyle: {color: 'white'},
          headerTintColor: 'white',
        }}
      />

      {/*HomePage Navigator*/}
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPasswordPage"
        component={ForgotPasswordPage}
        options={{
          headerShown: true,
          headerTitle: 'Forgot Password',
          headerTransparent: false,
          headerTintColor: 'black',
          headerStyle: {backgroundColor: '#464646'},
          headerTitleStyle: {color: 'white'},
          drawerLabelStyle: {color: 'white'},
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="EnterUserInfoPage"
        component={EnterUserInfoPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TargetProfilePage"
        component={TargetProfilePage}
        options={{
          headerShown: true,
          headerTitle: 'Profile',
          headerTransparent: false,
          headerTintColor: 'black',
          headerStyle: {backgroundColor: '#464646'},
          headerTitleStyle: {color: 'white'},
          drawerLabelStyle: {color: 'white'},
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="RequestServicePage"
        component={RequestServicePage}
        options={{
          headerShown: true,
          headerTitle: 'Request Service',
          headerTransparent: false,
          headerTintColor: 'black',
          headerStyle: {backgroundColor: '#464646'},
          headerTitleStyle: {color: 'white'},
          drawerLabelStyle: {color: 'white'},
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ApplyServicer"
        component={ApplyServicer}
        options={{
          headerShown: true,
          headerTitle: 'Apply',
          headerTransparent: false,
          headerTintColor: 'black',
          headerStyle: {backgroundColor: '#464646'},
          headerTitleStyle: {color: 'white'},
          drawerLabelStyle: {color: 'white'},
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
            <Stack.Screen
        name="MapPage"
        component={MapPage}
        options={{
          headerShown: true,
          headerTitle: 'Map',
          headerTransparent: false,
          headerTintColor: 'black',
          headerStyle: {backgroundColor: '#464646'},
          headerTitleStyle: {color: 'white'},
          drawerLabelStyle: {color: 'white'},
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="ReviewPage"
        component={ReviewPage}
        options={{
          headerShown: true,
          headerTitle: 'Review Page',
          headerTransparent: false,
          headerTintColor: 'black',
          headerStyle: {backgroundColor: '#464646'},
          headerTitleStyle: {color: 'white'},
          drawerLabelStyle: {color: 'white'},
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

const HomeScreenNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="TheHome" component={TheHome} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
const SearchPageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="SearchPage" component={SearchPage} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
const FavoritePageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="FavoritePage" component={FavoritePage} options={{headerShown: false}}/>
     
    </Stack.Navigator>
  );
}
const ProfilePageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="ProfilePage" component={ProfilePage} options={{headerShown: false}}/>
      <Stack.Screen name="EditProfilePage" component={EditProfilePage} options={{headerShown: true,
                headerTitle: '',
                headerTransparent:true,
                headerTintColor: 'black'}}/>
      <Stack.Screen name="PictureSelectPage" component={PictureSelectPage} options={{headerShown: true,
      headerTitle: '',
      headerTransparent:true,
      headerTintColor: 'black',
      headerStyle: {
        height: -150, // set the height to 80px
      },}}/>
    </Stack.Navigator>
  );
}
const NotificationPageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="NotificationPage" component={NotificationPage} options={{headerShown: false}}/>
      <Stack.Screen name="Open" component={SettingsPageNavigator} options={{headerShown: true}}/>
    </Stack.Navigator>
  );
}
const SettingsPageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="SettingsPage" component={SettingsPage} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

const RequestOrderHistoryPageNavigiator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="RequestOrderHistoryPage" component={RequestOrderPage} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
const OrderHistoryPageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="OrderHistoryPage" component={OrderHistoryPage} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
const ContactSupportPageNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="ContactSupportPage" component={ContactSupportPage} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}
export { 
  MainStackNavigator, 
  HomeScreenNavigator, 
  SearchPageNavigator, 
  FavoritePageNavigator, 
  ProfilePageNavigator,
  NotificationPageNavigator,
  SettingsPageNavigator,
  OrderHistoryPageNavigator,
  ContactSupportPageNavigator ,
  RequestOrderHistoryPageNavigiator
};