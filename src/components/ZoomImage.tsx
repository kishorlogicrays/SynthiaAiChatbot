import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {COLORS} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IZoomImage {
  imageUri: string;
}

const ZoomImage = ({imageUri}: IZoomImage) => {
  const image = [{url: imageUri}];
  const [isOpenImageView, setIsOpenImageView] = useState(false);
  const [valid, setValid] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);
  const noImageUri =
    'https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';

  return isOpenImageView ? (
    <View>
      <Modal visible={true} transparent={true}>
        <View>
          <Ionicons
            name="chevron-back"
            size={wp(6)}
            color="#FFFFFF"
            style={styles.backIcon}
            onPress={() => setIsOpenImageView(false)}
          />
        </View>
        <ImageViewer
          imageUrls={image}
          enableSwipeDown
          renderIndicator={() => null}
          onSwipeDown={() => setIsOpenImageView(false)}
          enableImageZoom={true}
        />
      </Modal>
    </View>
  ) : (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.chatPhotoContainer}
      onPress={() => valid && imageUri && setIsOpenImageView(true)}>
      {loadingImage && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={COLORS.white} />
        </View>
      )}

      <ImageBackground
        onError={() => setValid(false)}
        style={[
          styles.chatPhotoContainer,
          {height: '100%', width: '100%', position: 'relative'},
        ]}
        imageStyle={{borderRadius: 10}}
        source={{uri: imageUri ? imageUri : noImageUri, cache: 'force-cache'}}
        resizeMode={'cover'}
        resizeMethod={'resize'}
        onLoadEnd={() => setLoadingImage(false)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatPhotoContainer: {
    width: wp(50),
    height: hp(25),
  },
  loader: {
    zIndex: 99,
    flex: 1,
    top: hp(25) / 2,
  },
  backIcon: {
    top: wp(4),
    left: wp(5),
    zIndex: 999,
    position: 'absolute',
  },
  downloadIcon: {
    top: wp(3),
    right: wp(5),
    zIndex: 999,
    position: 'absolute',
  },
});
export default ZoomImage;
