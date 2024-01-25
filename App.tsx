import React from 'react';
import Routes from './src/routes';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {COLORS} from './src/constants';

const App = () => {
  return (
    <View style={{backgroundColor: COLORS.background, flex: 1}}>
      <SafeAreaView />
      <StatusBar
        animated={false}
        backgroundColor={COLORS.background}
        barStyle={'light-content'}
      />
      <Routes />
    </View>
  );
};

export default App;
