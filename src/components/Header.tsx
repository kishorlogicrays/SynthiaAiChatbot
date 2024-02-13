import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, images} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SvgIcon} from '../utils/SvgIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Header = ({onPress, isLogout, logout}: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <SvgIcon
          icon={images.back}
          style={{marginVertical: 10, marginStart: 5}}
        />
      </TouchableOpacity>
      {isLogout && (
        <TouchableOpacity activeOpacity={0.9} onPress={logout}>
          <AntDesign
            name="logout"
            size={24}
            color={COLORS.white}
            style={{marginEnd: 5}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(6.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
});

export default Header;
