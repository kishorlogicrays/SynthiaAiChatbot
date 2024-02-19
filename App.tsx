import React, {useEffect} from 'react';
import Routes from './src/routes';
import {ContextProvider} from './src/context/ContextProvider';
import {Platform, SafeAreaView, StatusBar, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {COLORS} from './src/constants';
import {requestMultiplePermissions} from './src/utils/AskPermission';
import {
  IronSource,
  InitializationEvents as InitEvent,
} from 'ironsource-mediation';

const App = () => {
  useEffect(() => {
    const timeOut = setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    IronSource.init(Platform?.OS === 'android' ? '1d7a9f555' : '1d7bad02d');
    InitEvent.onInitializationComplete.setListener(() => {
      console.log('onInitializationComplete');
    });

    IronSource.validateIntegration();
    IronSource.setAdaptersDebug(true);
    requestMultiplePermissions();

    return () => clearTimeout(timeOut);
  }, []);

  return (
    <View style={{backgroundColor: COLORS.background, flex: 1}}>
      <ContextProvider>
        <SafeAreaView />
        <StatusBar
          animated={false}
          backgroundColor={COLORS.background}
          barStyle={'light-content'}
        />
        <Routes />
      </ContextProvider>
    </View>
  );
};

export default App;
