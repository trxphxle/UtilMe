import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import React, {useState, useRef} from 'react';
import CustomButton from '../../components/CustomButton/Button';
import {ReactNativeFirebase} from '@react-native-firebase/app';
import FireBaseAuth from '@react-native-firebase/auth';
import background from '../../../assets/images/Background1.png';

const SignUpPage = ({navigation}) => {
  //array = emptry string
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    FireBaseAuth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Account Created Sucessfully');
        navigation.navigate('EnterUserInfoPage');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          alert('That email address is invalid!');
        } else alert(error.message);
      });
  };

  //Check if input entrys are empty to fix empty error
  const handleCheck = () => {
    if (email.trim().length == 0) {
      alert('Please enter your email');
    } else if (password.trim().length == 0) {
      alert('Please enter your password');
    } else {
      console.log('Signing up...');
      handleSignup();
    }
  };
  const passwordRef = useRef();
  return (
    <View style={styles.root}>
      <ImageBackground
        source={background}
        resizeMode="cover"
        style={styles.image}>
        {/* */}
        <Text style={styles.words}>Create</Text>
        <Text style={styles.words}>Account</Text>
        <Text style={styles.words}></Text>
        <Text style={{fontWeight: 'bold', paddingLeft: 30, color: 'white'}}>
          Your Email:
        </Text>

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

        <Text style={{fontWeight: 'bold', paddingLeft: 30, color: 'white'}}>
          Password:
        </Text>

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

        <View style={styles.AgreeStyle}>
          <Text>I Agree and Understand the Terms and Conditions</Text>
        </View>

        <View style={styles.buttonstyle}>
          <CustomButton ButtonText="Sign Up" onPressEvent={handleCheck} />
        </View>
        {/* <View style={styles.buttonstyle}>
          <CustomButton
            ButtonText="Skip"
            onPressEvent={() => navigation.navigate('EnterUserInfoPage')}
            type="TERTIARY"
          />
        </View> */}
      </ImageBackground>
    </View>
  );
};
//() =>navigation.navigate('SignUpPage')
const styles = StyleSheet.create({
  root: {
    flex: 1,
    //flexDirection: 'column',
    //alignItems: 'center',
    //paddingTop: 50,
    //paddingLeft: 30,//added
    //backgroundColor: '#F1F1F1',
  },
  words: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
    paddingLeft: 30,
  },
  inputcolor: {
    color: 'black',
    //fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: '85%',
    margin: 28,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 25,
    //borderBottomColor: '#FF9666',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonstyle: {
    width: '112%',
    //alignItems: 'center',
    paddingLeft: 30,
    paddingTop: 20,
  },
  AgreeStyle: {
    paddingTop: 20,
    paddingLeft: 30,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default SignUpPage;
