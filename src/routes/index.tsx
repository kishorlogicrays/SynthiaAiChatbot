import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import TabNavigation from './TabNavigator';
import Chat from '../screens/Chat';
import Welcome from '../screens/Welcome';
import VideoPlayerAndroid from '../screens/VideoPlayerAndroid';
import Login from '../screens/Login';
import {getValueInAsync} from '../utils/AsyncStorage';
import useAppContext from '../context/useAppContext';
import SignUp from '../screens/SignUp';

const Stack = createNativeStackNavigator();

const index = () => {
  const {setAuthUser}: any = useAppContext();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isSeenIntro, setIsSeenIntro] = useState(false);

  function onAuthStateChanged(user: any) {
    setUser(user);
    setAuthUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    introValueCheck();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const introValueCheck = async () => {
    const seeIntroOnce = await getValueInAsync('checkIntro');
    setIsSeenIntro(seeIntroOnce === null ? false : true);
  };

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}
        initialRouteName={user ? 'Main' : isSeenIntro ? 'Login' : 'Welcome'}>
        <Stack.Group>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Main" component={TabNavigation} />
          <Stack.Screen name="ChatScreen" component={Chat} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerAndroid} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default index;
