import React from 'react';
import Routes from './src/routes';
import {ContextProvider} from './src/context/ContextProvider';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {COLORS} from './src/constants';

const App = () => {
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
