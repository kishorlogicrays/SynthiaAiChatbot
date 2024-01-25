import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigation from './TabNavigator';
import Chat from '../screens/Chat';
import Welcome from '../screens/Welcome';

const index = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => ({
          headerShown: false,
        })}
        initialRouteName={'Welcome'}>
        <Stack.Group>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Main" component={TabNavigation} />
          <Stack.Screen name="ChatScreen" component={Chat} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default index;
