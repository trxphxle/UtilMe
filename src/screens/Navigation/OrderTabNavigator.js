import React from "react";
import { View, Text, StyleSheet, Image, screenOptionStyle } from 'react-native'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { OrderHistoryPageNavigator, RequestOrderHistoryPageNavigiator} from "./StackNavigator";

const Tab = createBottomTabNavigator();

const OrderBottomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{showIcon: true, showLabel: true}}>

          <Tab.Screen 
          name="Incoming Orders" 
          component={OrderHistoryPageNavigator} 
          options=
          {{ 
            headerShown: false,
            headerTitleAlign: 'center',
            headerStyle:{backgroundColor: '#464646'},
            headerTitleStyle: { color: 'white'},
            tabBarIcon: ({color}) => 
              {
               return (
                <View>
                   <FontAwesome5 name={'mail-bulk'} size={20} color={color}/>
                </View>
                      )
              },
            tabBarActiveTintColor: '#FF9666',
            tabBarInactiveTintColor: 'black',
          }} />
           <Tab.Screen 
          name="Order Sent" 
          component={RequestOrderHistoryPageNavigiator} 
          options=
          {{ 
            headerShown: false,
            headerTitleAlign: 'center',
            headerStyle:{backgroundColor: '#464646'},
            headerTitleStyle: { color: 'white'},
            tabBarIcon: ({color}) => 
              {
               return (
                <View>
                   <FontAwesome5 name={'box'} size={20} color={color}/>
                </View>
                      )
              },
            tabBarActiveTintColor: '#FF9666',
            tabBarInactiveTintColor: 'black',
          }} />


     

      </Tab.Navigator>
    );
  };
  
  export default OrderBottomTabNavigator;