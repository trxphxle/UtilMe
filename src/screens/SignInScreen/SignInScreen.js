import { View,
   Text,
   Image,
   StyleSheet,
   useWindowDimensions,
   ScrollView,
   ImageBackground,
   KeyboardAvoidingView,
  TextInput} from 'react-native' 
import React, {useState, useRef} from 'react'
import Logo from "../../../assets/images/utilmelogosmall.png";
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton/Button';
import FireBaseAuth from '@react-native-firebase/auth';
import background from '../../../assets/images/Background12.png'


const SignInScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const{height} = useWindowDimensions();

  
  //Check with firebase and if user and password are correct. Sign in and navigate to Homepage
  const handleLogin = () => {
    FireBaseAuth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredentials =>{
      const user = userCredentials.user;
      console.log('Logged in with:', user.email);
      navigation.navigate("HomePage")
    })
    .catch(error => alert(error.message))
  }

  //Check if input entrys are empty to fix empty error
  const handleCheck = () =>
  {
    if (email.trim().length ==0)
    {
      alert("Please enter your email");
    }
    else if (password.trim().length == 0)
    {
      alert("Please enter your password");
    }
    else{
      console.log('Signing in...');
      handleLogin()
    }
  }
  const passwordRef = useRef();
  return (
    <KeyboardAvoidingView style={styles.container}  behavior="padding">
    <ImageBackground source={background} resizeMode="stretch" style={styles.image} >
    <View style={styles.root}>
      
      <Image source={Logo} style={[styles.logo, {height: height* 0.3}]} 
      resizeMode = "contain"
       />
      
      <View style={styles.input}>
          <TextInput
            style={styles.inputcolor}
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
            blurOnSubmit={false}
            placeholder="Email:"
            value={email}
            onChangeText={text => setEmail(text)}
            placeholderTextColor="black"
          />
        </View>
        <View style={styles.input}>
          <TextInput
            style={styles.inputcolor}
            placeholder="Password:"
            ref={passwordRef}
            value={password}
            onChangeText={text => setPassword(text)}
            returnKeyType="done"
            onSubmitEditing={handleCheck}
          />
        </View>

      <CustomButton ButtonText="Sign In" onPressEvent={handleCheck}/>
      <CustomButton 
      ButtonText="Forgot Password" 
      onPressEvent={() =>navigation.navigate('ForgotPasswordPage')} 
      type="TERTIARY"
      />

      <CustomButton 
      ButtonText="Don't have an account? SIGN UP" 
      onPressEvent={() =>navigation.navigate('SignUpPage')} 
      type="TERTIARY"
      />
    
    <CustomButton 
      ButtonText="Skip Log in" 
      onPressEvent={() =>navigation.navigate('HomePage')} 
      type="TERTIARY"
      />
      
    </View>
    </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles= StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#f2f2f2',
  },
  root:{
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 100
    
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 250,
    
  },
  image: {
    //flex: 1,
    justifyContent: 'center',
    //position: 'absolute'
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: '80%',

    borderColor: 'black',
    borderWidth: 0,
    borderRadius: 20,

    paddingHorizontal: 15,
    marginVertical: 15,
  },
})
export default SignInScreen