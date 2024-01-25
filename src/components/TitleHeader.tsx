import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS, FONT} from '../constants';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const TitleHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: wp(2.6),
  },
  title: {
    color: COLORS.white,
    fontSize: wp(5.6),
    fontFamily: FONT.notoSansBold,
  },
});

export default TitleHeader;
