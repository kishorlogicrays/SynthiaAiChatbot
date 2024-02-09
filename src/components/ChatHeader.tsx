import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONT} from '../constants';
import {useNavigation} from '@react-navigation/native';
import {RewardedVideo} from '../utils/IronSource';
import useAppContext from '../context/useAppContext';

const ChatHeader = ({title, shouldBackBtnVisible}: any) => {
  const {adsDetails}: any = useAppContext();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        {shouldBackBtnVisible && (
          <TouchableOpacity
            onPress={() => {
              adsDetails?.showAdsGlobally && RewardedVideo();
              navigation?.goBack();
            }}>
            <Ionicons
              name="arrow-back-circle-outline"
              color={COLORS.white}
              size={hp(3.8)}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.heading}>
          {shouldBackBtnVisible ? `Synthia ${title}` : 'Synthia AI'}
        </Text>
      </View>
      <View style={styles.backContainer}>
        {/* <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal-circle"
            color={COLORS.white}
            size={hp(3.8)}
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(5),
    flexDirection: 'row',
    marginTop: hp(1),
    marginBottom: wp(2.6),
  },
  titleContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: COLORS.white,
    fontFamily: FONT.notoSansMedium,
    fontSize: hp(2.4),
  },
  backContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatHeader;
