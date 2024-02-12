import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, FONT} from '../constants';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {loadInterstitial} from '../utils/IronSource';
import useAppContext from '../context/useAppContext';

interface IProps {
  data: {};
}

const Card = (props: IProps) => {
  const {adsDetails}: any = useAppContext();
  const navigation: any = useNavigation();
  const {data}: any = props;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        adsDetails?.showAdsGlobally && loadInterstitial();
        navigation?.navigate('ChatScreen', {
          aiType: data?.title,
          shouldBackBtnVisible: true,
        });
      }}
      style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={data?.image} style={{height: wp(15), width: wp(15)}} />
      </View>
      <View style={styles.backContainer}>
        <Image
          source={data?.background}
          style={{height: wp(18), width: wp(18), borderTopRightRadius: wp(5)}}
        />
      </View>
      <Text style={styles.title}>{data?.additionalTitle}</Text>
      <Text style={styles.description}>{data?.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cards,
    flex: 1,
    marginHorizontal: wp(1.3),
    marginVertical: wp(1.3),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: wp(2.6),
  },
  imageContainer: {
    marginStart: wp(1),
    marginTop: wp(1.3),
    alignSelf: 'flex-start',
  },
  backContainer: {
    position: 'absolute',
    right: 0,
  },
  title: {
    marginStart: wp(2.6),
    fontSize: wp(4.6),
    marginTop: wp(2.6),
    color: COLORS.white,
    fontFamily: FONT.notoSansExtraBold,
  },
  description: {
    marginStart: wp(2.6),
    fontSize: wp(3.9),
    marginTop: wp(1.3),
    color: '#959494',
    fontFamily: FONT.notoSansRegular,
  },
});

export default Card;
