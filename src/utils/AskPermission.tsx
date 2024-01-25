import {Alert, Button, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const checkMicrophonePermission = async () => {
  console.log('check permission');
  try {
    const result = await check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    );
    console.log('result --', result);
    if (result === RESULTS.GRANTED) {
      return true;
    }
  } catch (error) {
    console.error('Error checking microphone permission:', error);
  }
};

export const requestMicrophonePermission = async () => {
  try {
    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO,
    );
    if (result === RESULTS.GRANTED) {
      return true;
    }
  } catch (error) {
    console.error('Error requesting microphone permission:', error);
  }
};
