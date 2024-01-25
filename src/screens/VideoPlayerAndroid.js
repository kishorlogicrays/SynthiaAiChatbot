import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../constants';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import useOrientation from '../hooks/useOrientation';
import Slider from '@react-native-community/slider';

const VideoPlayerAndroid = props => {
  const videoRef = useRef();
  const screenOrientation = useOrientation();
  const [paused, setPaused] = useState(false);
  const [focus, setFocus] = useState(true);
  const [controlShow, setControlShow] = useState(true);
  const [screen, setScreen] = useState(
    screenOrientation?.isPortrait ? 'contain' : 'stretch',
  );
  const [loader, setLoader] = useState(true);
  const [duration, setDuration] = useState(0.0);
  const [progress, setProgress] = useState(0);
  const [getCurrentPosition, setGetCurrentPosition] = useState(0.0);

  useEffect(() => {
    Orientation?.unlockAllOrientations();
    return () => Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    const subscribe = setTimeout(() => {
      setFocus(false);
    }, 3000);

    return () => clearTimeout(subscribe);
  }, [focus]);

  const handleOnLoad = loadData => {
    loadData?.naturalSize ? setLoader(false) : setLoader(true);
    setDuration(loadData?.duration);
  };

  const handleOnProgress = onProgressData => {
    setGetCurrentPosition(onProgressData?.currentTime);
    setProgress(onProgressData?.currentTime / duration);
  };

  const secondsToTime = time => {
    return ~~(time / 60) + ':' + (time % 60 < 10 ? '0' : '') + (time % 60);
  };

  const handleProgressMovePress = value => {
    setLoader(true);
    const position = value?.nativeEvent?.locationX * 1.84;
    const stringyValue = JSON.stringify(position);
    let prePointValue = stringyValue.split('.')[0];
    let postPointValue = stringyValue.split('.')[1].slice(0, 2);
    videoRef?.current?.seek(Number(prePointValue), Number(postPointValue));
    setLoader(false);
  };

  const previousHandler = async time => {
    if (getCurrentPosition < 10) {
      videoRef?.current?.seek(0);
      setGetCurrentPosition(0.0);
    } else {
      setLoader(true);
      let getTime = getCurrentPosition + time;
      await new Promise(resolve => setTimeout(resolve, 200));
      videoRef?.current?.seek(getTime);
      paused && setGetCurrentPosition(getTime);
      setLoader(false);
    }
  };

  const PlayPauseHandler = () => {
    if (progress >= 1) {
      videoRef?.current?.seek(0);
    }
    setPaused(!paused);
  };

  const nextHandler = async time => {
    let getTime = getCurrentPosition + time;
    if (duration < getTime) {
      await new Promise(resolve => setTimeout(resolve, 200));
      videoRef?.current?.seek(duration);
      setGetCurrentPosition(duration);
    } else {
      setLoader(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      videoRef?.current?.seek(getTime);
      paused && setGetCurrentPosition(getTime);
      setLoader(false);
    }
  };

  const handleVideoError = error => {
    console.log('Error in Handler Errror --->', error);
  };

  return (
    <SafeAreaView style={styles.container} onTouchStart={() => setFocus(true)}>
      {screenOrientation?.isPortrait === false && <StatusBar hidden />}

      {!controlShow && (
        <View style={[styles.headerContainer, {position: 'absolute'}]}>
          <View
            style={[
              styles.screenViewContainer,
              {
                marginStart: hp(5),
                marginTop: hp(3),
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (controlShow) {
                  screenOrientation?.isPortrait
                    ? Orientation?.lockToPortrait()
                    : Orientation?.lockToLandscape();
                  setControlShow(false);
                } else {
                  Orientation?.unlockAllOrientations();
                  setControlShow(true);
                }
              }}>
              {controlShow ? (
                <Ionicons
                  name="lock-open-outline"
                  size={hp(4)}
                  color={COLORS.white}
                />
              ) : focus ? (
                <Ionicons
                  name="lock-closed-outline"
                  size={hp(4)}
                  color={COLORS.white}
                />
              ) : (
                <></>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {focus && controlShow && (
        <View style={styles.headerContainer}>
          <View style={styles.backContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => props?.navigation?.goBack()}>
              <Ionicons
                name="chevron-back-outline"
                size={hp(4)}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.titleContainer,
              {width: screenOrientation?.isPortrait ? '50%' : '80%'},
            ]}>
            <Text
              style={styles.textStyle}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {props?.route?.params?.VideoDetails?.title}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              left: 0,
              right: 0,
            }}>
            <View style={styles.screenViewContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  screen == 'stretch'
                    ? setScreen('contain')
                    : setScreen('stretch')
                }>
                {screen === 'stretch' ? (
                  <Ionicons
                    name="scan-outline"
                    size={hp(4)}
                    color={COLORS.white}
                  />
                ) : (
                  <Ionicons
                    name="expand-outline"
                    size={hp(4)}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.screenViewContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (controlShow) {
                    screenOrientation?.isPortrait
                      ? Orientation?.lockToPortrait()
                      : Orientation?.lockToLandscape();
                    setControlShow(false);
                  } else {
                    Orientation?.unlockAllOrientations();
                    setControlShow(true);
                  }
                }}>
                {controlShow ? (
                  <Ionicons
                    name="lock-open-outline"
                    size={hp(4)}
                    color={COLORS.white}
                  />
                ) : (
                  <Ionicons
                    name="lock-closed-outline"
                    size={hp(4)}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {loader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            style={{flex: 1}}
            size={'large'}
            color={COLORS.white}
          />
        </View>
      )}

      {/* Control Buttons */}
      {loader ? (
        <></>
      ) : focus && controlShow ? (
        <View style={styles.controlContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => previousHandler(-10)}>
            <MaterialIcons name="replay-10" size={hp(5)} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{marginHorizontal: 30}}
            onPress={PlayPauseHandler}>
            <Ionicons
              name={paused ? 'play-circle-outline' : 'pause-circle-outline'}
              size={hp(8)}
              color={COLORS.white}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => nextHandler(10)}>
            <MaterialIcons
              name="forward-10"
              size={hp(5)}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}

      {/* Video seekBar */}
      {controlShow && focus && (
        <View style={styles.controlContainer}>
          <Slider
            style={styles.videoSeek}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={COLORS.white}
            maximumTrackTintColor={COLORS.white}
            value={progress}
            onResponderMove={e => handleProgressMovePress(e)}
          />
        </View>
      )}

      {controlShow && focus && (
        <View
          style={[
            styles.timerContainer,
            {
              paddingHorizontal: screenOrientation?.isPortrait
                ? hp(2.5)
                : hp(5),
            },
          ]}>
          <Text style={[styles.textStyle, {fontSize: hp(1.8), marginTop: 5}]}>
            {secondsToTime(Math.floor(getCurrentPosition))}
          </Text>
          <Text style={[styles.textStyle, {fontSize: hp(1.8), marginTop: 5}]}>
            {secondsToTime(Math.floor(duration))}
          </Text>
        </View>
      )}

      {/* Video screen design Style */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{
            uri: props?.route?.params?.VideoDetails?.url,
          }}
          style={styles.videoControl}
          fullscreen={screenOrientation?.isPortrait ? false : true}
          resizeMode={screen}
          paused={paused}
          disableFocus={true}
          progressUpdateInterval={1000}
          onLoad={e => handleOnLoad(e)}
          onProgress={e => handleOnProgress(e)}
          onEnd={e => setPaused(true)}
          onSeek={e => setLoader(false)}
          onError={e => handleVideoError(e)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    height: hp(8),
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    width: '100%',
    justifyContent: 'space-between',
  },
  backContainer: {
    width: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignSelf: 'center',
    marginHorizontal: hp(2),
    minWidth: hp(29),
    width: 'auto',
  },
  textStyle: {
    color: COLORS.white,
    fontFamily: FONT.notoSansMedium,
    fontSize: hp(2.5),
  },
  screenViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: hp(2),
  },
  videoContainer: {
    flex: 1,
    zIndex: -1,
  },
  videoControl: {
    height: '100%',
    width: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    alignContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  controlContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  videoSeek: {
    width: '90%',
    alignSelf: 'flex-end',
    marginHorizontal: hp(10),
    bottom: hp(5),
  },
  timerContainer: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    justifyContent: 'space-between',
    bottom: hp(2.8),
  },
});

export default VideoPlayerAndroid;
