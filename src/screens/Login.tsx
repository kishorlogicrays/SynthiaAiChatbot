import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {globalStyle} from '../styles/globalStyle';
import {COLORS, FONT, images} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import {object, string} from 'yup';
import {Formik} from 'formik';
import InputText from '../components/InputText';
import SubmitButton from '../components/SubmitButton';
import {useNavigation} from '@react-navigation/native';
import useAppContext from '../context/useAppContext';
import {getFCMToken, setCollectionData} from '../utils/Firebase';

const USERS: string = 'users';
export interface IToggle {
  loading: boolean;
  isClick: boolean;
}

const emailRegEx = /^[a-zA-Z0-9._-]+@[gmail]+\.[a-zA-Z]{2,4}$/;
let loginValidation = object({
  email: string()
    .matches(emailRegEx, 'Email address is not valid!')
    .required('Email address is required!'),
  password: string()
    .min(6, ({min}) => `Password must be at least ${min} characters.`)
    .required('Password is required!'),
});

const Login = () => {
  const {loginUser}: any = useAppContext();
  const navigation: any = useNavigation();
  const emailRef: any = useRef();
  const passwordRef: any = useRef();
  const [activeInputField, setActiveInputField] = useState('');
  const [handleToggle, setHandleToggle] = useState<IToggle>({
    loading: false,
    isClick: false,
  });

  const loginHandler = async (values: any) => {
    setHandleToggle({
      loading: true,
      isClick: true,
    });
    const fcmToken = await getFCMToken();
    const confirmation = await loginUser(values?.email, values?.password);
    if (confirmation?.code) {
      setHandleToggle({
        loading: false,
        isClick: false,
      });
    } else {
      await setCollectionData({fcmToken: fcmToken}, USERS);
      confirmation?.user?.uid &&
        navigation?.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
    }
  };

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validateOnMount={true}
      validationSchema={loginValidation}
      onSubmit={(values: any) => loginHandler(values)}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        values,
        isValid,
        errors,
      }: any) => (
        <View style={[globalStyle.container, styles.container]}>
          {/* Heading container */}
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Welcome!</Text>
            <Text style={styles.childText}>
              Welcome to AI Monk, your trusted companion for intelligent
              interactions.
            </Text>

            <LottieView
              source={images.login}
              autoPlay
              loop
              style={styles.logoContainer}
            />
          </View>
          <View style={{marginTop: wp(20)}}>
            <InputText
              name={'email'}
              refs={emailRef}
              placeHolderText={'Email address'}
              isNextFocus={passwordRef}
              isSecure={false}
              onBlurInput={handleBlur('email')}
              onChange={handleChange('email')}
              values={values?.email.toLowerCase()}
              isTouch={touched.email}
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
              name={'password'}
              textContainer={styles.userInputContainer}
              refs={passwordRef}
              placeHolderText={'Password'}
              isAutoFocus={false}
              isSecure={true}
              onBlurInput={handleBlur('password')}
              onChange={handleChange('password')}
              values={values?.password}
              isError={touched.password && errors.password}
              isEditable={!handleToggle?.loading}
              isTouch={touched.password}
              activeInputField={activeInputField}
              setActiveInputField={setActiveInputField}
            />
            {touched.password && errors.password ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation?.navigate('ForgotPassword')}
                style={{
                  marginTop: 2,
                  alignSelf: 'flex-end',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: FONT.notoSansMedium,
                  }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button Here */}
          <View style={styles.userInputContainer}>
            <SubmitButton
              isDisable={!isValid || handleToggle?.isClick}
              handleSubmitButton={handleSubmit}
              isLoading={handleToggle?.loading}
              title={'Submit'}
            />
          </View>

          <View style={{marginTop: wp(5)}}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text
                style={styles.register}
                onPress={() => navigation?.navigate('SignUp')}>
                Register Here
              </Text>
            </Text>
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingContainer: {},
  headingText: {
    fontFamily: FONT.notoSansExtraBold,
    color: COLORS.white,
    textAlign: 'center',
    fontSize: wp(6),
  },
  childText: {
    textAlign: 'center',
    fontFamily: FONT.notoSansMedium,
    color: COLORS.white,
    marginTop: wp(3),
    marginHorizontal: wp(6),
  },
  logoContainer: {
    marginTop: wp(10),
    height: hp(24),
    width: hp(24),
    alignSelf: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  signUpText: {
    textAlign: 'center',
    fontFamily: FONT.notoSansMedium,
    color: COLORS.white,
    fontSize: wp(3.6),
  },
  register: {color: COLORS.border, fontWeight: 'bold'},
});

export default Login;
