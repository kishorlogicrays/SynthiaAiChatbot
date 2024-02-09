import React, {useEffect} from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {globalStyle} from '../styles/globalStyle';
import HeaderProfile from '../components/HeaderProfile';
import AIBotView from '../components/AIBotView';
import TitleHeader from '../components/TitleHeader';
import Card from '../components/Card';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import useAppContext from '../context/useAppContext';
import {loadInterstitial} from '../utils/IronSource';

const features = [
  {
    id: 0,
    title: 'Art',
    description:
      'Create digital arts, learn art, history and express bring your thoughts to life',
    image: 'draw',
    color: '#74683d',
  },
  {
    id: 1,
    title: 'Code',
    description:
      'Generate programming codes or algorithms for complex work application and website',
    image: 'code-braces',
    color: '#ed86fe',
  },
  {
    id: 2,
    title: 'Booking',
    description:
      'Find tourist attraction, book flights, hotels and lean about more places',
    image: 'book',
    color: '#347936',
  },
  {
    id: 3,
    title: 'Content',
    description: 'Write contents for your articles, websites and blogs',
    image: 'content-paste',
    color: '#fc577e',
  },
  {
    id: 4,
    title: 'Health',
    description:
      'Learn more about medical conditions, get solutions and recommendations',
    image: 'heart-pulse',
    color: '#fc4e58',
  },
  {
    id: 5,
    title: 'Translate',
    description: 'Translate your text to any language instantly',
    image: 'translate',
    color: '#8ebce8',
  },
  {
    id: 6,
    title: 'Music',
    description: 'Write song with AI',
    image: 'content-paste',
    color: '#8a5ef1',
  },
  {
    id: 7,
    title: 'Movies',
    description:
      'You can find and review more movies and checking details of upcoming movies',
    image: 'movie-filter',
    color: '#61f8cb',
  },
];

const Home = (props: any) => {
  const {fetchCurrentUserData, adsDetails}: any = useAppContext();

  useEffect(() => {
    adsDetails?.showAdsGlobally && loadInterstitial();
    fetchCurrentUserData();
  }, []);

  return (
    <View style={[globalStyle.container]}>
      <View style={styles.modalContainer}>
        <HeaderProfile />
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
    </View>
  );
};

const styles = StyleSheet.create({
  flatContainer: {
    marginBottom: 100,
  },
  modalContainer: {margin: wp(2.6)},
});

export default Home;
