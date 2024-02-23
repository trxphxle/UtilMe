/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);
//firebase cloud messaging handles messgaes in the background or when its closed
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
      // App has been launched in the background by iOS, ignore
    return null;
  }
  return <App />;
}
AppRegistry.registerHeadlessTask('app', () => HeadlessCheck);
