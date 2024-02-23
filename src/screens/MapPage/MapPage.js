import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React from 'react';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps';
import Geocoding from 'react-native-geocoding';
import firestore from '@react-native-firebase/firestore';
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const MapPage = () => {
  const mapRef = React.useRef(null);
  const [userLocations, setUserLocations] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState('');
  const _scrollView = React.useRef(null);
  let mapAnimation = new Animated.Value(0);
  const handleSearch = async () => {
    try {
      const response = await Geocoding.from(searchInput);
      if (response.results.length > 0) {
        const {lat, lng} = response.results[0].geometry.location;
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    Geocoding.init('AIzaSyBrGcfETqC9kI_vi5ATFvnSXAflHkNWNgc');
    const unsubscribe = firestore()
      .collection('UserInfo')
      .onSnapshot(querySnapshot => {
        const locations = [];
        querySnapshot.forEach(documentSnapshot => {
          locations.push(documentSnapshot.data());
        });
        setUserLocations(locations);
      });
    return () => unsubscribe();
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Enter an address"
          style={styles.searchBar}
          onChangeText={text => setSearchInput(text)}
          value={searchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{flex: 1}}
        initialRegion={{
          latitude: 34.2584,
          longitude: -118.54908,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        ref={mapRef}>
        {userLocations.map(userLocation => (
          <Marker
            title={userLocation.Name}
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}>
            <Image
              style={styles.markerImage}
              source={require('../../../assets/images/MapMarker.png')}
            />
            <Callout>
              <View style={styles.calloutContainer}>
                <Text  style={{ width: '100%', height: '100%' , flex: 1, }}>            <Image
                 resizeMode="cover"
                  style={styles.calloutImage}
                  source={{uri: userLocation.profilePic}}
                 
                />
                </Text>
                <Text style={styles.calloutText}>{userLocation.Name}</Text>
                <Text style={styles.calloutText}>{userLocation.job}</Text>
                <Text style={styles.calloutText}>{userLocation.PhoneNumber}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <Animated.ScrollView
  ref={_scrollView}
  horizontal
  pagingEnabled
  scrollEventThrottle={1}
  showsHorizontalScrollIndicator={false}
  snapToInterval={CARD_WIDTH + 20}
  snapToAlignment="center"
  style={styles.scrollView}
  contentInset={{
    top: 0,
    left: SPACING_FOR_CARD_INSET,
    bottom: 0,
    right: SPACING_FOR_CARD_INSET
  }}
  contentContainerStyle={{
    paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
  }}
  onScroll={Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: mapAnimation,
          }
        },
      },
    ],
    {useNativeDriver: true}
  )}
>
  {userLocations.map((location, index) => (
    <View style={styles.card} key={index}>
      <Image 
        source={{uri: location.profilePic}}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.textContent}>
        <Text numberOfLines={1} style={styles.cardtitle}>{location.Name}</Text>
        <Text numberOfLines={1} style={styles.cardDescription}>{location.job}</Text>
        <Text numberOfLines={1} style={styles.cardDescription}>{location.PhoneNumber}</Text>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.signIn, {
              borderColor: '#FF6347',
              borderWidth: 1
            }]}
          >
            <Text style={[styles.textSign, {
              color: '#FF6347'
            }]}>Request Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ))}
</Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  searchButton: {
    width: 80,
    height: 40,
    backgroundColor: '#FF9666',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  markerImage: {
    width: 35,
    height: 35,
  },
  calloutContainer: {
    //flexDirection: 'row',
    alignItems: 'center',
    //padding: 1,
    height: 150, width: 150,
    
  },
  calloutImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    //marginRight: 10,
    resizeMode: "cover",
  },
  calloutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },container: {
    flex: 1,
  },
  searchBox: {
    position:'absolute', 
    marginTop: Platform.OS === 'ios' ? 40 : 20, 
    flexDirection:"row",
    backgroundColor: '#fff',
    width: '90%',
    alignSelf:'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position:'absolute', 
    top:Platform.OS === 'ios' ? 90 : 80, 
    paddingHorizontal:10
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection:"row",
    backgroundColor:'#fff', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width:50,
    height:50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5
  },
  signIn: {
      width: '100%',
      padding:5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 3
  },
  textSign: {
      fontSize: 14,
      fontWeight: 'bold'
  }
});

export default MapPage;
