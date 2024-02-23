import { StyleSheet, Text, View, TextInput } from 'react-native' //import scrollview if needed to extend page
import React, { useEffect, useState } from 'react'
import CustomButton from '../../components/CustomButton/Button';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
 

const ForgotpasswordPage = () => {
  
  const [email, setEmail] = useState('') //First field
  const [remail, setRemail] = useState('') //Second field
   
   
const handleCheck = () =>   //checks for empty fields or mismatch, else verify
{
  if (email.trim().length ==0)
  {
    alert("Please enter your email."); //empty 1st field
  }
  else if (remail.trim().length == 0)
  {
    alert("Please re-enter your email."); //empty 2nd field
  }
  else if (email != remail) 
  {
    alert("Both fields must match, please try again.") //fields don't match
  }
  else{ //call method for checking and sending email
    auth().sendPasswordResetEmail(email)
    console.log('Verifying and scanning database for account...');  
    handleSendpass()
  }
}

//configures Firebase app to send email to registered email (via email id)
const handleSendpass = () => {

// authorize firebase to check database for email

//^^^ need to look up more on fetchSignInMethodsForEmail API (will take an email and return a promise that resolves)

// below is for sending the email
  
  // if(user acc found in firebase then using fetchSignInMethodsForEmail) 
  // {
    // return firebase.auth().sendPasswordResetEmail(email)
  // }
  // else {
    // alert("Invalid email, account could not be found.")
  // }
   
}

  return (
    
    //view of everything

    <View style={styles.container}>

      <Text style={styles.words}> </Text>

      <Text style={styles.words}> Forgot Password? Here to help.  </Text>
      
      <Text style={styles.words}> </Text>

      <Text style={styles.description}>Please enter and re-enter your email below. After clicking submit, you will be sent an email containing your password. </Text>
      
      <Text style={styles.words}> </Text>

      <View style={styles.input}>
        <TextInput placeholder= "Email address goes here..." value={email} onChangeText={text => setEmail(text)} />
      </View>

      <Text style={styles.words}> </Text>

      <View style={styles.input}>
        <TextInput placeholder= "Please re-enter email address here..." value={remail} onChangeText={text => setRemail(text)} />
      </View>
    
      <Text style={styles.words}> </Text>

      <View style={styles.buttoncenter}>
        <CustomButton ButtonText="Send Me My Password!" onPressEvent={handleCheck}/>
      </View>
       
      
    </View>
  )
}

const styles = StyleSheet.create({
  
  words:{

    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',

  },

  buttoncenter:{
    alignItems:'center',
  },
  
  container: {
   
    flex:1,
    backgroundColor: '#F5E9BE',

  },

  description: {
    fontSize: 14,
    color: 'orange',
    textAlign: 'center',
  },

  input: {
        
    backgroundColor: 'white',
    width: '85%',
    margin: 28,
    borderColor: '#F5E9BE',
    borderWidth: 1,
    borderRadius: 10,
    //borderBottomColor: '#FF9666',
    paddingHorizontal: 10,
    marginVertical: 10,
    
    
  },
  
})

export default ForgotpasswordPage



