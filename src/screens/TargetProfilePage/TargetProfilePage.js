import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextStyle,
  FlatList,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../components/CustomButton/Button';
import background from '../../../assets/images/Background6.png';
import Icon from 'react-native-vector-icons/FontAwesome';

const TargetProfilePage = ({navigation}) => {
  const [userInfo, setUserInfo] = useState([]); //target userinfo data
  const [userInfo3, setUserInfo3] = useState([]); //current logged in userinfo data
  const route = useRoute();
  const userId = route.params?.id; //target userid
  const [totalCount, setTotalCount] = useState(0);
  function getCurrentUserID() { //current user id
    const currentUser = auth().currentUser;
    const userID = currentUser.uid;
    return userID;
  }
  const userID = getCurrentUserID(); //User ID number
  const [userInfo2, setUserInfo2] = useState([]);
  //
  const addLikes = async () => {
    firestore()
    .collection('UserInfo')
    //.where('userId', '==',user.uid)
    .doc(userId)
    .collection('notifications')
    .doc(userID)
    .set({
      title: userInfo3.Name,
      body: 'Like your profiles!',
      createdAt: new Date().getTime(),
    })
    .then(() => {
      console.log('User added!!!');
      //navigation.navigate("HomePage")
    })
    .catch(error => alert(error.message));
  }
  //
  const subscriberinfo = firestore()
  .collection('UserInfo')
  .doc(userId)
  .collection('Review');
  const HeartButton = ({count}) => {
    const [isLiked, setIsLiked] = useState(false);
    
    useEffect(() => {
      const checkIfLiked = async () => {
        const userLikesRef = firestore()
          .collection('UserInfo')
          .doc(userId)
          .collection('userLikes')
          .doc(userID);
  
        const doc = await userLikesRef.get();
  
        setIsLiked(doc.exists);
      };
  
      checkIfLiked();
    },[]);
  
    const handlePress = () => {
      const userLikesRef = firestore()
        .collection('UserInfo')
        .doc(userId)
        .collection('userLikes')
        .doc(userID);
  
      if (isLiked) {
        userLikesRef
          .delete()
          .then(() => {
            console.log('Like removed!');
          })
          .catch((error) => {
            console.error('Error removing like:', error);
          });
      } else {
        addLikes();
        userLikesRef
          .set({
            Name: userID,
          })
          .then(() => {
            console.log('Like added!');
          })
          .catch((error) => {
            console.error('Error adding like:', error);
          });
      }
  
      setIsLiked(!isLiked);
      
    };
    const checkIfLiked = async () => {
      const userLikesRef = firestore()
        .collection('UserInfo')
        .doc(userId)
        .collection('userLikes')
        .doc(userID);

      const doc = await userLikesRef.get();

      setIsLiked(doc.exists);
    };
      //When returning to the page. It updates
  useFocusEffect(
    React.useCallback(() => {
      checkIfLiked();
    }, [])
  );

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{ paddingLeft: 8, flexDirection: 'row', alignItems: 'center', paddingBottom: 9 }}
      >
        <Icon name={isLiked ? 'heart' : 'heart-o'} size={20} color="red" />
        <Text style={{ marginLeft: 5 }}>{count}</Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    // Get a reference to the collection
    const collectionRef = firestore().collection('UserInfo').doc(userId).collection('userLikes');
    //Get data of current logged in user.
    firestore()
    .collection('UserInfo')
    .doc(auth().currentUser.uid)
    .onSnapshot(documentSnapshot => {
      setUserInfo3(documentSnapshot.data());
    });
    // Get the total number of documents in the collection
    collectionRef.get().then((querySnapshot) => {
      const totalCount = querySnapshot.size;
      setTotalCount(totalCount);
    }).catch((error) => {
      console.error('Error getting documents:', error);
    });

    try{
        //First get UserInfo/UserID/Review and snapshot the document
      subscriberinfo.onSnapshot(querySnapShot => {
        const userInfo2 = [];
        //snapshot UserInfo/UserID/Review/Document atributes
        querySnapShot.forEach(doc => {
          const {Name} = doc.data();
          const {explanation} = doc.data();
          const {reviews} = doc.data();
          const {url}= doc.data();
         // console.log('What inside', profilePic);
          userInfo2.push({
            Name,
            id: doc.id,
            explanation,
            reviews,
            url,//profilepic
          });
        });
        setUserInfo2(userInfo2); //Saves FIRESTORE data into UserInfo via setUserInfo
      });
      //Show data in the log
      //console.log('inside userinfo2:',userInfo2);
    }catch{console.log("error catch in search page")}
  }, []);

  //const [name, setName] = useState('');

  useEffect(() => {
    const subscriberinfo = firestore()
      .collection('UserInfo')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        setUserInfo(documentSnapshot.data()); //Saves FIRESTORE data into UserInfo via setUserInfo
       // console.log('Thehome: ', documentSnapshot.data()); //Show data in the log
      });
    return subscriberinfo; // unsubscribe on unmount
  }, []);
  return (
    <View>
      <ImageBackground
        source={background}
        resizeMode="stretch"
        style={{...styles.image, height: "100%"}}
        >
           <ScrollView>
            
        <View style={styles.centered}>
          <Image
            style={{height: 200, width: 200, borderRadius: 10}}
            source={{uri: userInfo.profilePic}}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.text}>{userInfo.Name}</Text>
            <HeartButton count={totalCount} />
          </View>
        </View>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
          <Text style={styles.text}>About Me</Text>
          <FontAwesome5.Button
            style={{paddingVertical: 11}}
            backgroundColor="white"
            borderRadius={20}>
            <Text style={styles.BubbleWord}>{userInfo.Description} </Text>
          </FontAwesome5.Button>
        </View>
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5}}>
          <Text style={styles.text}>Phone Number</Text>
          <FontAwesome5.Button
            style={{paddingVertical: 11}}
            backgroundColor="white"
            borderRadius={20}>
            <Text style={styles.BubbleWord}>{userInfo.PhoneNumber} </Text>
          </FontAwesome5.Button>
        </View>
        
        <View style={{paddingLeft: 20, width: '95%', marginBottom: 11.5, flex: 1}}>
          <Text style={styles.text}>My Reviews</Text>
          
          <FlatList
          style={{height: '50%'}}
          data={userInfo2}
          numColumns={1}
          renderItem={({item}) => (
            
              <View style={styles.container}>
                <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <Image style={{height: 50, width: 50, borderRadius: 100, }} source={{uri: item.url}} />
                <View style={{marginTop: 10, marginLeft: 10}}>
                <Text style={styles.text}>{item.Name} </Text>
                </View>
                </View>

                {/* <Text style={styles.text}>Subject: {item.explanation} </Text> */}
                <Text style={{marginLeft: 10, marginTop: 10}}> {item.reviews} </Text>
              </View>
           
          )}
        />
        <View
          style={{
            paddingTop: 10,
            paddingLeft: 50,
            width: '85%',
            alignItems: 'center',
          }}>
          <CustomButton
            ButtonText="Request Service"
            onPressEvent={() => navigation.navigate('RequestServicePage',{id: userId})}
          />
          <CustomButton
            ButtonText="Review"
            onPressEvent={() => navigation.navigate('ReviewPage', {id: userId})}
          />
        </View>
        </View>
      
        <Text style={{paddingTop: 10}}></Text>
        
    </ScrollView>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter',
    fontSize: 15.5,
    fontWeight: 'bold',
    color: '#141414',
    marginBottom: 15,
    textShadowColor: 'white',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  Nametext: {
    fontFamily: 'Inter',
    fontSize: 15.5,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  centered: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BubbleWord: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: 'normal',
    color: '#161616',
  },
  image: {
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 1,
  },
});
export default TargetProfilePage;
