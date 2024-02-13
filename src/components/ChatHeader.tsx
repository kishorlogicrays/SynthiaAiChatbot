import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS, FONT, images} from '../constants';
import {useNavigation} from '@react-navigation/native';
import {RewardedVideo} from '../utils/IronSource';
import useAppContext from '../context/useAppContext';
import {SvgIcon} from '../utils/SvgIcon';

const ChatHeader = ({title, shouldBackBtnVisible}: any) => {
  const {adsDetails}: any = useAppContext();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        {shouldBackBtnVisible && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              adsDetails?.showAdsGlobally &&
                RewardedVideo(adsDetails?.rewardPlacement);
              navigation?.goBack();
            }}>
            <SvgIcon
              icon={images.back}
              style={{marginVertical: 10, marginStart: 5}}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.heading}>
          {shouldBackBtnVisible ? `AI Monk ${title}` : 'AI Monk'}
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
