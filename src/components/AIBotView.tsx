import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONT, images} from '../constants';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import useAppContext from '../context/useAppContext';

const AIBotView = () => {
  const navigation: any = useNavigation();
  const {authUser}: any = useAppContext();
  return (
    <View style={styles.container}>
      {/* user Header */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation?.navigate('Profile')}
        style={styles.imageContainer}>
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
        <Text style={styles.userName}>
          {authUser?.fullName ? authUser?.fullName : 'User'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.animation}
        activeOpacity={1}
        onPress={() =>
          navigation?.navigate('ChatScreen', {
            aiType: 'AI',
            shouldBackBtnVisible: true,
          })
        }>
        <LottieView
          source={images.aiChatbot}
          autoPlay
          loop
          style={styles.logoContainer}
        />
      </TouchableOpacity>
      <Text style={styles.greetingText}>{`How may i help you today ?`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: wp(4),
    fontFamily: FONT.notoSansSemiBold,
    color: COLORS.lightWhite,
    marginBottom: wp(4),
    alignSelf: 'center',
  },
  animation: {padding: wp(5), alignItems: 'center'},
  logoContainer: {
    height: hp(30),
    width: hp(30),
  },
  imageContainer: {
    height: hp(6.5),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: wp(2),
  },
  headerImage: {
    height: hp(5),
    width: wp(10),
    borderRadius: wp(7),
    borderWidth: 1,
    borderColor: COLORS.white,
    marginStart: wp(2),
  },
  userName: {
    color: COLORS.white,
    marginStart: wp(2),
    fontFamily: FONT.notoSansMedium,
  },
});

export default AIBotView;
