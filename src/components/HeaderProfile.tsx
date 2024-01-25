import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../constants/theme';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderProfile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/a/AEdFTp6iAHlssoknpqM6HakGnp5vughnxSAIhksmwlly=k-s256',
          }}
          resizeMode="cover"
          style={styles.headerImage}
        />
      </View>

      <View style={styles.middleContainer}>
        <TouchableOpacity style={styles.inviteButton}>
          <Octicons name={'plus'} size={wp(4)} color={COLORS.white} />
          <Text style={styles.invite}>Invite</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sideContainer}>
        <View style={styles.settingContainer}>
          <Ionicons
            onPress={() => {}}
            name={'settings-outline'}
            size={wp(6)}
            color={COLORS.white}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(6.5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomEndRadius: wp(2.6),
    borderBottomStartRadius: wp(2.6),
  },
  imageContainer: {
    flex: 5,
    justifyContent: 'center',
  },
  headerImage: {
    height: hp(5),
    width: wp(10),
    borderRadius: wp(7),
    borderWidth: 1,
    borderColor: COLORS.white,
    marginStart: wp(2),
  },
  middleContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  inviteButton: {
    borderRadius: wp(10),
    maxWidth: hp(18),
    height: hp(5),
    backgroundColor: '#444547',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  invite: {
    color: COLORS.white,
    fontSize: wp(3.6),
    fontFamily: FONT.notoSansRegular,
  },
  sideContainer: {
    flex: 1,
  },
  settingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default HeaderProfile;
