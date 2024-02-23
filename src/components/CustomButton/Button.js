import { View, Text, StyleSheet, Pressable} from 'react-native'
import React from 'react'
//If custom button does not have a type. By default it is Primary
const Login = ({onPressEvent, ButtonText, type = "PRIMARY"}) => {
  return (
    <Pressable onPress={onPressEvent} style={[styles.container, styles[`container_${type}`]]}>
      <Text style={[styles.text, styles[`text_${type}`]]}>{ButtonText}</Text>
    </Pressable>
  )
};

const styles = StyleSheet.create({
  //Every container will have these settings
    container: {
        width: '80%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        
    },
    //container with Primary will have these settings (Default)
    container_PRIMARY: {
        backgroundColor: '#FF9666',
        borderRadius: 43,
    },
    container_TERTIARY: {
      borderRadius: 43,
    },
    container_LEFT:{
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15,
      backgroundColor: '#3d3f3f',
      width: '100%',
      padding: 20,
    },
    container_RIGHT:{
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      backgroundColor: '#FF9666',
      width: '100%',
      padding: 20,
    },
    //Every Button will have these text settings. 
    text: {
        fontWeight: 'bold',
        color: 'white',
        
    },
    //Tertiary overwrite the text color to orange instead of white(code above)
    text_TERTIARY: {
        color: '#FF9666',
        fontWeight: 'bold'
    },
    text_TERTIARY_WHITE: {
      color: 'white',
      fontWeight: 'bold'
    },
    text_LEFT: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
      
    },
    text_RIGHT: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
    },
})
export default Login