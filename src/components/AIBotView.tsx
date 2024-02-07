import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONT, images} from '../constants';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const AIBotView = () => {
  const navigation: any = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Welcome Back!</Text>
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
      <Text
        onPress={() =>
          navigation?.navigate('ChatScreen', {
            aiType: 'AI',
            shouldBackBtnVisible: true,
          })
        }
        style={{
          fontFamily: FONT.notoSansBold,
          fontSize: wp(5),
          color: COLORS.white,
        }}>
        Tap to chat
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp(5),
  },
  greetingText: {
    fontSize: wp(4),
    fontFamily: FONT.notoSansMedium,
    color: '#8a848e',
  },
  animation: {padding: wp(5)},
  logoContainer: {
    height: hp(30),
    width: hp(30),
  },
});

export default AIBotView;
