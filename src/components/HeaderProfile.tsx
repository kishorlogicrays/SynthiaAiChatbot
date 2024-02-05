import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS} from '../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAppContext from '../context/useAppContext';
import {images} from '../constants';

const HeaderProfile = () => {
  const {authUser}: any = useAppContext();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            authUser?.userImageUrl
              ? {
                  uri: authUser?.userImageUrl,
                }
              : images.userLogo
          }
          resizeMode="cover"
          style={styles.headerImage}
        />
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
