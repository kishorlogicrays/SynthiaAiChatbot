import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {globalStyle} from '../styles/globalStyle';
import {COLORS, FONT, images} from '../constants';
import {SCREEN_WIDTH} from '../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <View style={[globalStyle.container, styles.container]}>
      {/* Heading container */}
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Synthia AI</Text>
        <Text style={styles.childText}>The future by here, powered by AI</Text>
      </View>

      {/* Logo container */}
      <View>
        <Image source={images.logo} style={styles.logo} resizeMode="cover" />
      </View>

      {/* Button Container */}
      <TouchableOpacity
        style={styles.buttonContainer}
        activeOpacity={0.6}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{name: 'Main'}],
          })
        }>
        <Text style={[styles.headingText, {fontSize: 17}]}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingContainer: {},
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
  },
  logo: {
    marginTop: wp(30),
    height: wp(84),
    width: wp(84),
  },
  buttonContainer: {
    marginTop: wp(15),
    height: wp(12),
    width: wp(80),
    borderRadius: 10,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Welcome;