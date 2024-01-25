import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({onPress}: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <Ionicons
          name="chevron-back-outline"
          color={COLORS.white}
          size={hp(3.8)}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(6.5),
    justifyContent: 'center',
    paddingStart: wp(4),
  },
});

export default Header;
