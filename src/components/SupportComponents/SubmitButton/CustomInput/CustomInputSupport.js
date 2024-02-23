import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
const CustomInputSupport = ({placeholder, lines, numberOfLines, length}) => {
    return(
        <View style = {styles.all}>
            <TextInput 
            style = {styles.textInput}  
            placeholder = {placeholder}
            multiline = {lines} //allows to create new lines
            numberOfLines = {numberOfLines} //makes the amount of line
            //textaling we might need it
            maxLength = {length} //gives a max amount of characters
            //value (look up what value does)

            />
        </View>
    )
}
const styles = StyleSheet.create({
    all:{
        marginTop: 20,
        alignItems: 'center',
    },
    textInput:{
        //makes text go left
        paddingLeft: 30,
        //make the corners round
        borderRadius: 30,
        //background color
        backgroundColor: 'white',
        width: 350,
    }
})
export default CustomInputSupport;