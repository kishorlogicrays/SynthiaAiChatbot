import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {globalStyle} from '../styles/globalStyle';
import {Formik} from 'formik';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {COLORS, FONT, images} from '../constants';
import InputText from '../components/InputText';
import SubmitButton from '../components/SubmitButton';
import {object, string} from 'yup';
import LottieView from 'lottie-react-native';
import {IToggle} from './Login';
import useAppContext from '../context/useAppContext';
import {Alert} from 'react-native';

const emailRegEx = /^[a-zA-Z0-9._-]+@[gmail]+\.[a-zA-Z]{2,4}$/;
const forgotValidation = object({
  email: string()
    .matches(emailRegEx, 'Email address is not valid!')
    .required('Email address is required!'),
});

const ForgotPassword = () => {
  const {sendResetLink}: any = useAppContext();
  const emailRef: any = useRef();
  const navigation: any = useNavigation();
  const [activeInputField, setActiveInputField] = useState('');
  const [handleToggle, setHandleToggle] = useState<IToggle>({
    loading: false,
    isClick: false,
  });

  const forgotHandler = async (values: any) => {
    setHandleToggle({
      loading: true,
      isClick: true,
    });
    await sendResetLink(values?.email);
    Alert.alert('AI Monk', 'Please check your email to reset your password.');
    setHandleToggle({
      loading: false,
      isClick: false,
    });
  };
  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validateOnMount={true}
      validationSchema={forgotValidation}
      onSubmit={(values: any) => forgotHandler(values)}>
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
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.childText}>
            We'll send reset password link to your email address. You can change
            password to the link.
          </Text>
          <LottieView
            source={images.forgot}
            autoPlay
            loop
            style={styles.logoContainer}
          />
          <View
            style={{
              marginTop: wp(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <InputText
              name={'email'}
              placeHolderText={'Enter the email address'}
              isNextFocus={emailRef}
              isSecure={false}
              onBlurInput={handleBlur('email')}
              onChange={handleChange('email')}
              values={values?.email}
              isError={touched.email && errors.email}
              isEditable={!handleToggle?.loading}
              isTouch={touched.password}
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
          </View>

          <View style={styles.userInputContainer}>
            <SubmitButton
              isDisable={!isValid || handleToggle?.isClick}
              handleSubmitButton={handleSubmit}
              isLoading={handleToggle?.loading}
              title={'Submit'}
            />
          </View>
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
    alignSelf: 'center',
    fontFamily: FONT.notoSansExtraBold,
    fontSize: wp(6),
  },
  logoContainer: {
    marginTop: wp(6),
    height: hp(40),
    width: hp(30),
    alignSelf: 'center',
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
  childText: {
    textAlign: 'center',
    fontFamily: FONT.notoSansMedium,
    color: COLORS.white,
    marginTop: wp(3),
    marginHorizontal: wp(6),
  },
});

export default ForgotPassword;
