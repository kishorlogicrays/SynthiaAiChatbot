import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {globalStyle} from '../styles/globalStyle';
import {COLORS, FONT, images} from '../constants';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {object, string, ref} from 'yup';
import {Formik} from 'formik';
import InputText from '../components/InputText';
import SubmitButton from '../components/SubmitButton';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheets from '../components/BottomSheets';
import useAppContext from '../context/useAppContext';
import {createUser} from '../utils/Firebase';
import {SvgIcon} from '../utils/SvgIcon';
export interface IToggle {
  loading: boolean;
  isClick: boolean;
}

const emailRegEx = /^[a-zA-Z0-9._-]+@[gmail]+\.[a-zA-Z]{2,4}$/;
let signUpValidation = object({
  fullName: string().required('Full name is required'),
  email: string()
    .matches(emailRegEx, 'Email address is not valid!')
    .required('Email address is required!'),
  password: string()
    .min(6, ({min}) => `Password must be at least ${min} characters.`)
    .required('Password is required!'),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords does not match')
    .required('Confirm Password is required'),
});

const SignUp = () => {
  const {signUpUser}: any = useAppContext();
  const navigation: any = useNavigation();
  const emailRef: any = useRef();
  const passwordRef: any = useRef();
  const confirmPassRef: any = useRef();
  const refRBSheet: any = useRef();
  const [activeInputField, setActiveInputField] = useState('');
  const [handleToggle, setHandleToggle] = useState<IToggle>({
    loading: false,
    isClick: false,
  });
  const [profileImage, setProfileImage] = useState<any>(null);

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

  const signUpHandler = async (values: any) => {
    setHandleToggle({
      isClick: true,
      loading: true,
    });
    const userCollection = {
      ...values,
      userImageUrl: profileImage,
    };

    const confirmation = await signUpUser(values?.email, values?.password);
    if (confirmation.code) {
      setHandleToggle({
        isClick: false,
        loading: false,
      });
    } else {
      await createUser(userCollection, confirmation);
      navigation?.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    }
  };

  return (
    <Formik
      initialValues={{
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validateOnMount={true}
      validationSchema={signUpValidation}
      onSubmit={(values: any) => signUpHandler(values)}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        values,
        isValid,
        errors,
      }: any) => (
        <ScrollView style={[globalStyle.container]}>
          <Header onPress={() => navigation?.goBack()} />
          <Text style={styles.heading}>Sign Up</Text>

          {/* Profile Photo */}
          <View style={styles.photoContainer}>
            <View style={styles.imageViewContainer}>
              <Image
                source={profileImage ? {uri: profileImage} : images.userLogo}
                resizeMode="cover"
                style={styles.image}
              />
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => refRBSheet.current.open()}
                style={{position: 'absolute', bottom: 0, right: 0}}>
                <Ionicons name={'add-circle'} size={45} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              marginTop: wp(10),
              justifyContent: 'center',
              alignItems: 'center',
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
              isNextFocus={passwordRef}
              isSecure={false}
              onBlurInput={handleBlur('email')}
              isTouch={touched.email}
              onChange={handleChange('email')}
              values={values?.email.toLowerCase()}
              isError={touched.email && errors.email}
              isEditable={!handleToggle?.loading}
              activeInputField={activeInputField}
              setActiveInputField={setActiveInputField}
            />
            {touched.email && errors.email ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.email}</Text>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Text></Text>
              </View>
            )}

            <InputText
              name={'Password'}
              textContainer={styles.userInputContainer}
              refs={passwordRef}
              placeHolderText={'Password'}
              isNextFocus={confirmPassRef}
              isSecure={true}
              onBlurInput={handleBlur('password')}
              onChange={handleChange('password')}
              isTouch={touched.password}
              values={values?.password}
              isError={touched.password && errors.password}
              isEditable={!handleToggle?.loading}
              activeInputField={activeInputField}
              setActiveInputField={setActiveInputField}
            />
            {touched.password && errors.password ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Text></Text>
              </View>
            )}

            <InputText
              name={'confirmPassword'}
              textContainer={styles.userInputContainer}
              refs={confirmPassRef}
              placeHolderText={'Confirm Password'}
              isAutoFocus={false}
              isSecure={true}
              onBlurInput={handleBlur('confirmPassword')}
              onChange={handleChange('confirmPassword')}
              isTouch={touched.confirmPassword}
              values={values?.confirmPassword}
              isError={touched.confirmPassword && errors.confirmPassword}
              isEditable={!handleToggle?.loading}
              activeInputField={activeInputField}
              setActiveInputField={setActiveInputField}
            />
            {touched.confirmPassword && errors.confirmPassword ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Text></Text>
              </View>
            )}
          </View>

          <View style={styles.userInputContainer}>
            <SubmitButton
              isDisable={!isValid || handleToggle?.isClick}
              handleSubmitButton={handleSubmit}
              isLoading={handleToggle?.loading}
              title={'Submit'}
            />
          </View>

          <View
            style={{
              marginTop: wp(5),
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: wp(5),
            }}>
            <Text style={styles.signUpText}>
              Have already an account?{' '}
              <Text
                style={styles.register}
                onPress={() => navigation?.goBack()}>
                Login
              </Text>
            </Text>
          </View>

          <BottomSheets refs={refRBSheet} sheetHeight={'12%'}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetBoxContainer}>
                <TouchableOpacity
                  style={styles.boxContainer}
                  activeOpacity={0.9}
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
                  activeOpacity={0.9}
                  onPress={() => onButtonPress('gallery')}>
                  <Ionicons name="image" size={30} color={COLORS.white} />
                  <Text style={[styles.signUpText, {color: COLORS.white}]}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheets>
        </ScrollView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  heading: {
    marginTop: wp(2),
    color: COLORS.white,
    width: '90%',
    alignSelf: 'center',
    fontFamily: FONT.notoSansExtraBold,
    fontSize: wp(6),
  },
  photoContainer: {
    marginTop: wp(10),
    width: wp(40),
    height: wp(40),
    alignSelf: 'center',
    borderRadius: wp(20),
  },
  imageViewContainer: {},
  image: {
    height: wp(40),
    width: wp(40),
    alignSelf: 'center',
    borderRadius: wp(20),
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
  userInputContainer: {
    marginTop: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    textAlign: 'center',
    fontFamily: FONT.notoSansMedium,
    color: COLORS.white,
    fontSize: wp(3.6),
  },
  register: {color: COLORS.border, fontWeight: 'bold'},
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
});

export default SignUp;
