import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {globalStyle} from '../styles/globalStyle';
import {logoutUser} from '../utils/Firebase';

const Profile = () => {
  return (
    <View style={globalStyle.container}>
      <Text style={{color: '#fff', fontSize: 18}} onPress={() => logoutUser()}>
        Logout
      </Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
