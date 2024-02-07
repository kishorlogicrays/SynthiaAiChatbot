import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Formik} from 'formik';
import {object, string} from 'yup';
import ADIcons from 'react-native-vector-icons/AntDesign';
import {globalStyle} from '../styles/globalStyle';
import {logoutUser, getAuthUserId, updateUser} from '../utils/Firebase';
import images from '../constants/image';
import {COLORS, FONT, SCREEN_HEIGHT, SCREEN_WIDTH} from '../constants/theme';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import InputText from '../components/InputText';
import SubmitButton from '../components/SubmitButton';
import useAppContext from '../context/useAppContext';
import * as ImagePicker from 'react-native-image-picker';
import BottomSheets from '../components/BottomSheets';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface IToggle {
  loading: boolean;
  isClick: boolean;
}

let loginValidation = object({
  fullName: string().required('Full name is required'),
});

const Profile = () => {
  const emailRef: any = useRef();
  const {authUser}: any = useAppContext();
  const userId = getAuthUserId();
  const refRBSheet: any = useRef();
  const [profileImage, setProfileImage] = useState<any>(authUser?.userImageUrl);
  const [handleToggle, setHandleToggle] = useState<IToggle>({
    loading: false,
    isClick: false,
  });

  const updateHandler = async (values: any) => {
    setHandleToggle({
      isClick: true,
      loading: true,
    });
    const userCollection = {
      ...values,
      userImageUrl: profileImage,
    };

    await updateUser(userCollection, userId);
    setHandleToggle({
      isClick: false,
      loading: false,
    });
  };

  const onButtonPress = useCallback((type: any) => {
    let options: any = {
      maxWidth: 720,
      maxHeight: 1280,
      quality: 0.5,
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };
    if (type === 'camera') {
      ImagePicker.launchCamera(options, async (response: any) => {
        if (response?.didCancel) {
          refRBSheet?.current?.close();
          return;
        } else {
          setProfileImage(response?.assets[0]);
          refRBSheet?.current?.close();
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, async (response: any) => {
        if (response?.didCancel) {
          refRBSheet?.current?.close();
          return;
        } else {
          setProfileImage(response?.assets[0]);
          refRBSheet?.current?.close();
        }
      });
    }
  }, []);

  return (
    <View style={globalStyle.container}>
      <View style={styles.profilePicContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => logoutUser()}
          activeOpacity={0.9}>
          <ADIcons name="logout" color={'#FFFFFF'} size={15} />
          <Text style={{color: '#FFFFFF', fontSize: wp(3)}}>Logout</Text>
        </TouchableOpacity>
        <ImageBackground
          source={
            profileImage?.uri
              ? profileImage
              : profileImage
              ? {uri: profileImage}
              : images.userLogo
          }
          style={styles.profilePicture}
          imageStyle={styles.profilePictureStyle}>
          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            style={styles.editIconButton}
            activeOpacity={0.9}>
            <ADIcons
              name="camera"
              size={15}
              color={'#FFFFFF'}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.profileDetailsContainer}>
        <Formik
          initialValues={{
            fullName: authUser?.fullName,
            email: authUser?.email,
          }}
          validateOnMount={true}
          validationSchema={loginValidation}
          onSubmit={(values: any) => updateHandler(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            values,
            isValid,
            errors,
          }: any) => (
            <View
              style={{
                marginTop: wp(10),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <InputText
                placeHolderText={'Your full name'}
                isNextFocus={emailRef}
                isSecure={false}
                onBlurInput={handleBlur('fullName')}
                onChange={handleChange('fullName')}
                values={values?.fullName}
                isError={touched.fullName && errors.fullName}
                isEditable={!handleToggle?.loading}
                customStyle={{color: '#000000'}}
              />
              {touched.fullName && errors.fullName && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                </View>
              )}
              <InputText
                refs={emailRef}
                textContainer={styles.userInputContainer}
                placeHolderText={'Your email address'}
                isSecure={false}
                onBlurInput={handleBlur('email')}
                onChange={handleChange('email')}
                values={values?.email.toLowerCase()}
                isError={touched.email && errors.email}
                isEditable={false}
                customStyle={{color: '#888888'}}
              />

              <View style={styles.userInputContainer}>
                <SubmitButton
                  isDisable={!isValid || handleToggle?.isClick}
                  handleSubmitButton={handleSubmit}
                  isLoading={handleToggle?.loading}
                  title={'Update'}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
      <BottomSheets refs={refRBSheet} sheetHeight={'12%'}>
        <View style={styles.sheetContainer}>
          <View style={styles.sheetBoxContainer}>
            <TouchableOpacity
              style={styles.boxContainer}
              activeOpacity={0.9}
              onPress={() => onButtonPress('camera')}>
              <Ionicons name="camera" size={30} color={COLORS.background} />
              <Text style={[styles.signUpText, {color: COLORS.background}]}>
                Camera
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sheetBoxContainer}>
            <TouchableOpacity
              style={styles.boxContainer}
              activeOpacity={0.9}
              onPress={() => onButtonPress('gallery')}>
              <Ionicons name="image" size={30} color={COLORS.background} />
              <Text style={[styles.signUpText, {color: COLORS.background}]}>
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheets>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profilePicture: {
    height: SCREEN_WIDTH / 3,
    width: SCREEN_WIDTH / 3,
  },
  profilePictureStyle: {
    borderRadius: SCREEN_WIDTH / 6,
  },
  profilePicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: SCREEN_HEIGHT / 3,
  },
  editIcon: {},
  editIconButton: {
    backgroundColor: 'blue',
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    position: 'absolute',
    right: 3,
    bottom: 5,
  },
  logoutButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetailsContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 15,
  },
  userInputContainer: {
    marginTop: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000000',
  },
  errorContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginHorizontal: wp(8),
    marginTop: 2,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.danger,
    alignItems: 'center',
    marginStart: 2,
    fontFamily: FONT.notoSansRegular,
  },
  signUpText: {
    textAlign: 'center',
    fontFamily: FONT.notoSansMedium,
    color: COLORS.white,
    fontSize: wp(3.6),
  },
  sheetContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sheetBoxContainer: {flex: 1, justifyContent: 'center'},
  boxContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
