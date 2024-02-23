import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const CustomInput = ({value, setValue, placeholder, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <TextInput 
      value={value}
      onChangeText={setValue}
      placeholder= {placeholder}
      style={styles.input}
      secureTextEntry={secureTextEntry}
      />
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        width: '80%',

        borderColor: 'black',
        borderWidth: 0,
        borderRadius: 20,

        paddingHorizontal: 15,
        marginVertical: 15,
    },
    input: {},
});
export default CustomInput;