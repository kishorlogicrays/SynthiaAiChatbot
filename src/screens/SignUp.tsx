import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {globalStyle} from '../styles/globalStyle';
import {COLORS, FONT, images} from '../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {object, string} from 'yup';
import {Formik} from 'formik';
import InputText from '../components/InputText';
import SubmitButton from '../components/SubmitButton';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface IToggle {
  loading: boolean;
  isClick: boolean;
}

const emailRegEx = /^[a-zA-Z0-9._-]+@[gmail]+\.[a-zA-Z]{2,4}$/;
let loginValidation = object({
  userName: string().required('Username is required'),
  email: string()
    .matches(emailRegEx, 'Email address is not valid!')
    .required('Email address is required!'),
  password: string()
    .min(6, ({min}) => `Password must be at least ${min} characters.`)
    .required('Password is required!'),
});

const SignUp = () => {
  const navigation: any = useNavigation();
  const emailRef: any = useRef();
  const passwordRef: any = useRef();
  const [handleToggle, setHandleToggle] = useState<IToggle>({
    loading: false,
    isClick: false,
  });

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validateOnMount={true}
      validationSchema={loginValidation}
      onSubmit={(values: any) => {}}>
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
              <Image source={images.userLogo} style={styles.image} />
              <Ionicons name={'add-circle'} size={25} color={COLORS.white} />
            </View>
          </View>

          {/* <View
            style={{
              marginTop: wp(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <InputText
              refs={emailRef}
              placeHolderText={'Email address'}
              isNextFocus={passwordRef}
              isSecure={false}
              onBlurInput={handleBlur('email')}
              onChange={handleChange('email')}
              values={values?.email}
              isError={touched.email && errors.email}
              isEditable={!handleToggle?.loading}
            />
            {touched.email && errors.email && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.email}</Text>
              </View>
            )}

            <InputText
              textContainer={styles.userInputContainer}
              refs={passwordRef}
              placeHolderText={'Password'}
              isAutoFocus={false}
              isSecure={true}
              onBlurInput={() => handleBlur('password')}
              onChange={handleChange('password')}
              values={values?.password}
              isError={touched.password && errors.password}
              isEditable={!handleToggle?.loading}
            />
            {touched.password && errors.password && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            )}
          </View> */}

          {/* <View style={styles.userInputContainer}>
            <SubmitButton
              isDisable={!isValid || handleToggle?.isClick}
              handleSubmitButton={handleSubmit}
              isLoading={handleToggle?.loading}
              title={'Submit'}
            />
          </View> */}

          {/* <View
            style={{
              marginTop: wp(5),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.signUpText}>
              Have already an account?{' '}
              <Text
                style={styles.register}
                onPress={() => navigation?.goBack()}>
                Login
              </Text>
            </Text>
          </View> */}
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
    width: Dimensions.get('screen').width / 1.2,
    alignSelf: 'center',
    fontFamily: FONT.notoSansExtraBold,
    fontSize: wp(6),
  },
  photoContainer: {
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: wp(10),
    width: wp(40),
    height: wp(40),
    alignSelf: 'center',
  },
  imageViewContainer: {},
  image: {
    height: wp(40),
    width: wp(40),
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
    marginTop: wp(8),
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
});

export default SignUp;
