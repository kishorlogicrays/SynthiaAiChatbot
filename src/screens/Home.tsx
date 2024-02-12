import React, {useEffect} from 'react';
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {globalStyle} from '../styles/globalStyle';
import HeaderProfile from '../components/HeaderProfile';
import AIBotView from '../components/AIBotView';
import TitleHeader from '../components/TitleHeader';
import Card from '../components/Card';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useAppContext from '../context/useAppContext';
import {loadInterstitial} from '../utils/IronSource';
import {COLORS, FONT, images} from '../constants';
import {useNavigation} from '@react-navigation/native';

const features = [
  {
    id: 0,
    title: 'Art',
    additionalTitle: 'Art',
    description:
      'Create digital arts, learn art, history and express bring your thoughts to life',
    image: images.art,
    background: images.artBack,
  },
  {
    id: 1,
    title: 'Code',
    additionalTitle: 'Code',
    description:
      'Generate programming codes or algorithms for complex work application and website',
    image: images.code,
    background: images.codeBack,
  },
  {
    id: 2,
    title: 'Booking',
    additionalTitle: 'Booking',
    description:
      'Find tourist attraction, book flights, hotels and lean about more places',
    image: images.booking,
    background: images.bookingBack,
  },
  {
    id: 3,
    title: 'Content',
    additionalTitle: 'Content',
    description: 'Write contents for your articles, websites and blogs',
    image: images.content,
    background: images.contentBack,
  },
  {
    id: 4,
    title: 'Health',
    additionalTitle: 'Health & Medicine',
    description:
      'Learn more about medical conditions, get solutions and recommendations',
    image: images.health,
    background: images.healthBack,
  },
  {
    id: 5,
    title: 'Translate',
    additionalTitle: 'Translate',
    description: 'Translate your text to any language instantly',
    image: images.translate,
    background: images.translateBack,
  },
  {
    id: 6,
    title: 'Music',
    additionalTitle: 'Music',
    description: 'Write song with AI',
    image: images.music,
    background: images.musicBack,
  },
  {
    id: 7,
    title: 'Movies',
    additionalTitle: 'Movies',
    description:
      'You can find and review more movies and checking details of upcoming movies',
    image: images.movie,
    background: images.movieBack,
  },
];

const Home = (props: any) => {
  const {adsDetails, authUser}: any = useAppContext();

  useEffect(() => {
    adsDetails?.showAdsGlobally && loadInterstitial();
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
