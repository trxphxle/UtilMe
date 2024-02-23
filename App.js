import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Navigator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { MainStackNavigator} from "./src/screens/Navigation/StackNavigator"


 // {/*Comment */}
const App = () => {
  return (
    <View style={format.root}>
      <NavigationContainer>
        {/*Goes to StackNavigator.js*/} 
        <MainStackNavigator />
      </NavigationContainer>
    </View>

  );
};

const format = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5E9BE',
  }
});
// flex: 1,
// justifyContent: "center", //Center top to bottom
// alignItems: "center", //Center left to right
export default App;
