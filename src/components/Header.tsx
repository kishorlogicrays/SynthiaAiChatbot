import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, images} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SvgIcon} from '../utils/SvgIcon';

const Header = ({onPress}: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <SvgIcon icon={images.back} style={{marginTop: 10, marginStart: 5}} />
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
