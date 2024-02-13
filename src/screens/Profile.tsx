import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Formik} from 'formik';
import {object, string} from 'yup';
import {globalStyle} from '../styles/globalStyle';
import {
  logoutUser,
  getAuthUserId,
  updateUser,
  deleteUser,
} from '../utils/Firebase';
import images from '../constants/image';
import {COLORS, FONT} from '../constants/theme';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import InputText from '../components/InputText';
import SubmitButton from '../components/SubmitButton';
import useAppContext from '../context/useAppContext';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheets from '../components/BottomSheets';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import Spinner from '../utils/LoadingOverlays';
export interface IToggle {
  loading: boolean;
  isClick: boolean;
}

let loginValidation = object({
  fullName: string().required('Full name is required'),
});

const Profile = () => {
  const emailRef: any = useRef();
  const {authUser, fetchCurrentUserData}: any = useAppContext();
  const userId = getAuthUserId();
  const navigation: any = useNavigation();
  const refRBSheet: any = useRef();
  const [activeInputField, setActiveInputField] = useState('');
  const [profileImage, setProfileImage] = useState<any>(authUser?.userImageUrl);
  const [spinner, setSpinner] = useState(false);
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
      fullName: values.fullName,
      userImageUrl: profileImage,
    };
    await updateUser(userCollection, userId);
    setHandleToggle({
      isClick: false,
      loading: false,
    });
    Alert.alert(
      'AI Monk',
      'Details Udpated successfully',
      [
        {
          text: 'Ok',
          onPress: () => fetchCurrentUserData(),
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const onButtonPress = useCallback((type: any) => {
    if (type === 'camera') {
      ImagePicker.openCamera({
        cropping: true,
        width: 500,
        height: 500,
        includeExif: true,
        compressImageQuality: 0.8,
      })
        .then((image: any) => {
          setProfileImage(image?.path);
          refRBSheet?.current?.close();
        })
        .catch(e => refRBSheet?.current?.close());
    } else {
      ImagePicker.openPicker({
        cropping: true,
        width: 500,
        height: 500,
        includeExif: true,
        compressImageQuality: 0.8,
      })
        .then((image: any) => {
          setProfileImage(image?.path);
          refRBSheet?.current?.close();
        })
        .catch(e => refRBSheet?.current?.close());
    }
  }, []);

  const logoutAction = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to Logout?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            setSpinner(true);
            logoutUser()
              .then(() => {
                navigation?.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              })
              .catch(e => {
                console.log('error : ', e);
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const deleteAction = () => {
    Alert.alert(
      'Delete Account!',
      'Are you sure you want delete the account?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            setSpinner(true);
            deleteUser()
              .then(() => {
                navigation?.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              })
              .catch(e => {
                console.log('error : ', e);
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
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
        <View style={[globalStyle.container]}>
          <Spinner visible={spinner} textContent={'Loading...'} />
          <Header
            onPress={() => navigation?.goBack()}
            isLogout={true}
            logout={logoutAction}
          />

          {/* Profile Photo with circle container */}
          <View
            style={{
              borderWidth: 1,
              borderColor: '#525358',
              height: wp(44),
              width: wp(44),
              borderRadius: wp(22),
              marginTop: wp(20),
              alignSelf: 'center',
            }}
          />
          <View style={styles.platContainer}>
            <View style={styles.photoContainer}>
              <Image
                source={profileImage ? {uri: profileImage} : images.userLogo}
                resizeMode="cover"
                style={styles.image}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => refRBSheet.current.open()}
                style={{position: 'absolute', bottom: 0, right: 0}}>
                <Ionicons name={'add-circle'} size={45} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                top: wp(-10),
                alignSelf: 'center',
              }}>
              <InputText
                name={'fullName'}
                placeHolderText={'Enter the full name'}
                isNextFocus={emailRef}
                isSecure={false}
                onBlurInput={handleBlur('fullName')}
                onChange={handleChange('fullName')}
                values={values?.fullName}
                isTouch={touched.fullName}
                isError={touched.fullName && errors.fullName}
                isEditable={!handleToggle?.loading}
                activeInputField={activeInputField}
                setActiveInputField={setActiveInputField}
              />
              {touched.fullName && errors.fullName ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                </View>
              ) : (
                <View style={styles.errorContainer}>
                  <Text></Text>
                </View>
              )}

              <InputText
                name={'email'}
                refs={emailRef}
                textContainer={styles.userInputContainer}
                placeHolderText={'Enter the email address'}
                onBlurInput={handleBlur('email')}
                onChange={handleChange('email')}
                values={values?.email?.toLowerCase()}
                isEditable={false}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.deleteContainer}
              onPress={deleteAction}>
              <Text style={styles.deleteAccount}>Delete Account</Text>
            </TouchableOpacity>

            <View style={styles.userInputContainer}>
              <SubmitButton
                isDisable={!isValid || handleToggle?.isClick}
                handleSubmitButton={handleSubmit}
                isLoading={handleToggle?.loading}
                title={'Update Profile'}
              />
            </View>
          </View>
          <BottomSheets refs={refRBSheet} sheetHeight={'12%'}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetBoxContainer}>
                <TouchableOpacity
                  style={styles.boxContainer}
                  activeOpacity={0.8}
                  onPress={() => onButtonPress('camera')}>
                  <Ionicons name="camera" size={30} color={COLORS.white} />
                  <Text style={[styles.signUpText, {color: COLORS.white}]}>
                    Camera
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sheetBoxContainer}>
                <TouchableOpacity
                  style={styles.boxContainer}
                  activeOpacity={0.8}
                  onPress={() => onButtonPress('gallery')}>
                  <Ionicons name="image" size={30} color={COLORS.white} />
                  <Text style={[styles.signUpText, {color: COLORS.white}]}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheets>
        </View>
      )}
    </Formik>
  );
};

export default Profile;

const styles = StyleSheet.create({
  photoContainer: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    top: wp(-26),
    alignSelf: 'center',
  },
  image: {
    height: wp(40),
    width: wp(40),
    borderRadius: wp(20),
  },
  platContainer: {
    height: wp(100),
    width: '90%',
    backgroundColor: COLORS.cards,
    alignSelf: 'center',
    top: wp(-16),
    borderRadius: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.danger,
    alignItems: 'center',
    marginStart: 2,
    fontFamily: FONT.notoSansRegular,
  },
  userInputContainer: {
    marginTop: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteContainer: {
    alignSelf: 'flex-end',
    top: wp(-8),
    marginEnd: wp(5),
  },
  deleteAccount: {
    textDecorationLine: 'underline',
    color: COLORS.danger,
    fontFamily: FONT.notoSansMedium,
  },
  sheetContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sheetBoxContainer: {flex: 1, justifyContent: 'center'},
  boxContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  signUpText: {
    textAlign: 'center',
    fontFamily: FONT.notoSansMedium,
    color: COLORS.white,
    fontSize: wp(3.6),
  },
});
