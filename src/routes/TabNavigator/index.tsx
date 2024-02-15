import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Home from '../../screens/Home';
import Chat from '../../screens/Chat';
import Profile from '../../screens/Profile';

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();

  const tabList = [
    {
      name: 'Home',
      component: Home,
    },
    {
      name: 'Chat',
      component: Chat,
    },
    {
      name: 'Profile',
      component: Profile,
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home">
      <Tab.Group>
        {tabList?.map((item: any, index: any) => {
          return (
            <Tab.Screen
              key={item?.name}
              name={item?.name}
              component={item?.component}
              options={{
                tabBarShowLabel: false,
                tabBarStyle: {
                  backgroundColor: COLORS.background,
                  borderTopWidth: 0,
                  elevation: 0,
                  height: wp(16),
                },
                tabBarIcon: ({color, size, focused}): any => {
                  if (focused) {
                    return (
                      <Ionicons
                        name={
                          item?.name == 'Home'
                            ? 'home'
                            : item?.name == 'Chat'
                            ? 'chatbubble'
                            : 'person'
                        }
                        size={size}
                        color={COLORS.background}
                        style={{
                          backgroundColor: COLORS.white,
                          padding: hp(1),
                          borderRadius: wp(2.5),
                        }}
                      />
                    );
                  }

                  return (
                    <Ionicons
                      name={
                        item?.name == 'Home'
                          ? 'home-outline'
                          : item?.name == 'Chat'
                          ? 'chatbubble-outline'
                          : 'person-outline'
                      }
                      size={wp(6)}
                      color={color}
                    />
                  );
                },
              }}
            />
          );
        })}
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default TabNavigation;
