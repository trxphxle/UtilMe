import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'

const Sbutton = ({name, text}) => {
  return (
    <View style = {styles.nonButton}>
      <Pressable title = {name} style = {styles.container}>
          <Text style = {styles.textButton}>{text}</Text>
      </Pressable>
    </View>
  )
};
const styles = StyleSheet.create({
  container: {
    width:230,
    padding: 9,
    borderRadius:43,
    marginTop: 290,
    backgroundColor: '#FF9666',
},
  nonButton:{
    display:'flex',
    alignItems: 'center'
    
  },
  textButton: {
    paddingLeft: 45,
    color: 'white',
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
  }
})
export default Sbutton