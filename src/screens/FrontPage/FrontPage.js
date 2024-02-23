import { View, Text, StyleSheet, Image, useWindowDimensions ,SafeAreaView, Button, ImageBackground} from 'react-native'
import React from 'react'
import Logo from "../../../assets/images/utilmelogosmall.png";
import CustomButton from '../../components/CustomButton/Button';
import background from '../../../assets/images/Background11.png';

const FrontPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/*Logo*/}
      
      <ImageBackground source={background} resizeMode="cover" style={styles.image} >
      <SafeAreaView>
        <View style={styles.root}>
          <Image 
            source={Logo} 
            style={styles.logo} resizeMode = "contain"/>
          
        </View>
      </SafeAreaView>

      <View style={styles.buttons}>
        
        {/*<Button  title= "mybutton" onPress={() =>navigation.navigate('SignInScreen')}/>*/}
        
        {/*Sign in button*/}
        <CustomButton ButtonText="Log In" onPressEvent={() =>navigation.navigate('SignInScreen')}> </CustomButton>
        {/*Sign Up Button*/}
        <CustomButton 
          ButtonText="Sign Up" 
          onPressEvent={() =>navigation.navigate('SignUpPage')}
          type="TERTIARY_WHITE"
      />
      
      </View>
      </ImageBackground>
    </View>
  )
}

const styles= StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#F5E9BE',
  },
  root:{
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 150
    
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 250,
  },
  buttons:{
    alignItems: 'center',
    paddingTop: 100,
  },
  image: {
    flex: 1,
  },
})
export default FrontPage