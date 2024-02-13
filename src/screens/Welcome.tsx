import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {globalStyle} from '../styles/globalStyle';
import {COLORS, FONT, images} from '../constants';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {storeValueInAsync} from '../utils/AsyncStorage';
import {SvgIcon} from '../utils/SvgIcon';

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View style={[globalStyle.container, styles.container]}>
      {/* Logo container */}
      <View>
        <SvgIcon
          icon={images.welcome}
          style={{marginTop: wp(24)}}
          preserveAspectRatio="none"
        />
      </View>

      {/* Heading container */}
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Our Intelligent Chat</Text>
        <Text style={[styles.headingText, {color: COLORS.pupal}]}>AI Monk</Text>
        <Text style={styles.childText}>
          {`The future by here, powered by AI.\AI Monk understands you, providing tailored solutions and insights.`}
        </Text>
      </View>

      {/* Button Container */}
      <TouchableOpacity
        style={styles.buttonContainer}
        activeOpacity={0.9}
        onPress={async () => {
          await storeValueInAsync('checkIntro', true);
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }}>
        <Text style={[styles.headingText, {fontSize: 17}]}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headingContainer: {
    marginTop: wp(16),
  },
  headingText: {
    fontFamily: FONT.notoSansExtraBold,
    color: COLORS.white,
    textAlign: 'center',
    fontSize: wp(6),
  },
  childText: {
    textAlign: 'center',
    fontFamily: FONT.notoSansMedium,
    color: COLORS.white,
    marginTop: wp(3),
    marginHorizontal: wp(3),
  },
  buttonContainer: {
    marginTop: wp(15),
    height: wp(12),
    width: wp(60),
    borderRadius: wp(40),
    backgroundColor: COLORS.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp(10),
  },
});

export default Welcome;
