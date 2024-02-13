import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {globalStyle} from '../styles/globalStyle';
import AIBotView from '../components/AIBotView';
import TitleHeader from '../components/TitleHeader';
import Card from '../components/Card';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useAppContext from '../context/useAppContext';
import {loadInterstitial} from '../utils/IronSource';
import features from '../../assets/data';

const Home = () => {
  const {adsDetails, fetchCurrentUserData}: any = useAppContext();

  useEffect(() => {
    adsDetails?.showAdsGlobally && loadInterstitial();
    fetchCurrentUserData();
  }, []);

  return (
    <View style={[globalStyle.container]}>
      <View style={styles.flatContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={features}
          renderItem={({item, index}) => <Card data={item} />}
          numColumns={2}
          keyExtractor={(item, index) => index}
          ListHeaderComponent={() => {
            return (
              <View>
                <AIBotView />
                <TitleHeader />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flatContainer: {
    paddingHorizontal: wp(2.6),
  },
});

export default Home;
