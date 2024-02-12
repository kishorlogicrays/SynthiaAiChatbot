import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import TabNavigation from './TabNavigator';
import Chat from '../screens/Chat';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import {getValueInAsync} from '../utils/AsyncStorage';
import useAppContext from '../context/useAppContext';
import SignUp from '../screens/SignUp';
import NavigationService from './NavigationService';
import ForgotPassword from '../screens/ForgotPassword';

const Stack = createNativeStackNavigator();

const index = () => {
  const {setAuthUser, setAiAPIKey, setAdsDetails, fetchCurrentUserData}: any =
    useAppContext();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isSeenIntro, setIsSeenIntro] = useState(false);

  function onAuthStateChanged(user: any) {
    setUser(user);
    setAuthUser(user);
    if (user?.email) {
      fetchCurrentUserData();
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    introValueCheck();
    getAiAPIKey();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const getAiAPIKey = async () => {
    const confirmationResponse: any = await firestore()
      .collection('Config')
      .get();
    const {
      ChatGPT,
      androidAppKey,
      interstitialPlacement,
      iosAppKey,
      rewardPlacement,
      showAdsGlobally,
    } = confirmationResponse?._docs[0]?._data;
    const detailsAds = {
      androidAppKey,
      interstitialPlacement,
      iosAppKey,
      rewardPlacement,
      showAdsGlobally,
    };
    setAdsDetails(detailsAds);
    setAiAPIKey(ChatGPT);
  };

  const introValueCheck = async () => {
    const seeIntroOnce = await getValueInAsync('checkIntro');
    setIsSeenIntro(seeIntroOnce === null ? false : true);
  };

  if (initializing) return null;

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={() => {
        NavigationService.isReadyRef.current = true;
        NavigationService.routeNameRef.current =
          NavigationService.navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={() => {
        const currentRouteName =
          NavigationService.navigationRef.current.getCurrentRoute().name;
        NavigationService.routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}
        initialRouteName={user ? 'Main' : isSeenIntro ? 'Login' : 'Welcome'}>
        <Stack.Group>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Main" component={TabNavigation} />
          <Stack.Screen name="ChatScreen" component={Chat} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default index;
