import React from "react";
import { View, Text, StyleSheet, Image, screenOptionStyle } from 'react-native'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { HomeScreenNavigator, SearchPageNavigator, FavoritePageNavigator, ContactStackNavigator } from "./StackNavigator";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{showIcon: true, showLabel: true}}>

          <Tab.Screen 
          name="Home" 
          component={HomeScreenNavigator} 
          options=
          {{ 
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle:{backgroundColor: '#464646'},
            headerTitleStyle: { color: 'white'},
            tabBarIcon: ({color}) => 
              {
               return (
                <View>
                   <FontAwesome5 name={'home'} size={20} color={color}/>
                </View>
                      )
              },
            tabBarActiveTintColor: '#FF9666',
            tabBarInactiveTintColor: 'black',
          }} />

        <Tab.Screen 
        name="Search" 
        component={SearchPageNavigator} 
        options=
        {{ 
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle:{backgroundColor: '#464646'},
          headerTitleStyle: { color: 'white'},
          tabBarIcon: ({color}) => 
            {
            return (
              <View>
                <FontAwesome5 name={'search'} size={20} color={color}/>
              </View>
                    )
            },
          tabBarActiveTintColor: '#FF9666',
          tabBarInactiveTintColor: 'black',
        }} />

        <Tab.Screen 
        name="Favorites" 
        component={FavoritePageNavigator} 
        options=
        {{ 
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle:
          {
            backgroundColor: '#464646'
          },
        headerTitleStyle: { color: 'white'},
        tabBarIcon: ({color}) => {
          return (
            <View>
             <FontAwesome5 name={'star'} size={20} color={color}/>
            </View>
          )
        },
        tabBarActiveTintColor: '#FF9666',
        tabBarInactiveTintColor: 'black',
        }} />

      </Tab.Navigator>
    );
  };
  
  export default BottomTabNavigator;