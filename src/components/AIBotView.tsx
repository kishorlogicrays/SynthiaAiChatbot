import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONT, images} from '../constants';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

const AIBotView = () => {
  const navigation: any = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Welcome Back!</Text>
      <TouchableOpacity onPress={() => navigation?.navigate('ChatScreen')}>
        <Image
          source={images.logo}
          style={styles.logoContainer}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text
        onPress={() => navigation?.navigate('ChatScreen')}
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
  logoContainer: {
    height: hp(30),
  },
});

export default AIBotView;
