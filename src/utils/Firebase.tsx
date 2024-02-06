import auth, {firebase} from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

const firebaseAuth: any = auth();
const db: any = firestore();
const dbStorage: any = storage();

const USERS: string = 'users';
const PROFILE: string = 'profile';
const CHAT: string = 'generalChat';
const ART: string = 'artChat';
const CODE: string = 'codeChat';
const BOOKING: string = 'bookingChat';
const CONTENT: string = 'contentChat';
const HEALTH: string = 'healthChat';
const TRANSLATE: string = 'translateChat';
const MUSIC: string = 'musicChat';
const MOVIES: string = 'moviesChat';

/**
 * Returns a user identifier as specified by the authentication provider.
 */
export const getAuthUserId = () => firebaseAuth.currentUser?.uid;

/**
 * get FCM token
 */
export const getFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  return fcmToken;
};

/**
 * Returns document's identifier within its users collection.
 */
export const getImageDocId = () => db.collection(USERS).doc().id;

/**
 * Returns a string pointing to users-> userId -> profile location path on the storage bucket.
 *
 * @param userId A slash-separated documentPath to a document.
 */
const imageStoragePath = (userId: any) => `${USERS}/${userId}/${PROFILE}/`;

/**
 *
 * @param timestamp Provide date
 */
export const convertDate = (timestamp: any) => {
  if (timestamp && typeof timestamp === 'object' && timestamp.seconds) {
    return new firebase.firestore.Timestamp(
      timestamp.seconds,
      timestamp.nanoseconds,
    ).toDate();
  } else if (timestamp && typeof timestamp === 'string') {
    console.log('String');
    return new Date(timestamp);
  }
  return timestamp;
};

/**
 *
 * @param date Provide a date object
 */
export const convertDateToTimestamp = (date: any) =>
  firebase.firestore.Timestamp.fromDate(date).toDate();

/**
 *
 * @param email user email address to signUp and store in database
 * @param password user password to signUp and store in database
 * @returns list down in user in firebase and data store.
 */

export const signUpWithEmailPassword = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((confirmResult: any) => {
        confirmResult?.user?.sendEmailVerification();
        resolve(confirmResult);
      })
      .catch((error: any) => {
        console.log('Error creating user -', error);
        reject(error);
      });
  });
};

export const signInWithEmailPassword = async (
  email: string,
  password: string,
) => {
  return new Promise((resolve, reject) => {
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((confirmResult: any) => {
        resolve(confirmResult);
      })
      .catch((error: any) => {
        console.log('Error while login -', error);
        reject(error);
      });
  });
};

export const getUserData = async (userId: any) => {
  const currentUserId = await getAuthUserId();
  const userDetails = await db
    .collection(USERS)
    .doc(userId ? userId : currentUserId)
    .get();

  return userDetails;
};

export const storeChatCommunication = async (
  chatMessage: any,
  type = 'generalChat',
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findType =
        type === 'generalChat'
          ? CHAT
          : type === 'Art'
          ? ART
          : type === 'Code'
          ? CODE
          : type === 'Booking'
          ? BOOKING
          : type === 'Content'
          ? CONTENT
          : type === 'Health'
          ? HEALTH
          : type === 'Translate'
          ? TRANSLATE
          : type === 'Music'
          ? MUSIC
          : type === 'Movies'
          ? MOVIES
          : CHAT;
      const currentUserId = await getAuthUserId();
      const queryMessage = await db
        .collection(findType)
        .doc(`${currentUserId}-AI`);
      await queryMessage.set({
        chat_id: `${currentUserId}-AI`,
        last_message: chatMessage?.text
          ? chatMessage?.text
          : chatMessage?.image,
        createdAt: JSON.stringify(chatMessage?.createdAt),
        user_name: chatMessage?.user?.name,
      });
      const newCollection = await queryMessage
        .collection(`${currentUserId}-AI`)
        .add({
          ...chatMessage,
          createdAt: JSON.stringify(chatMessage?.createdAt),
        });
      resolve(newCollection);
    } catch (error) {
      reject(error);
    }
  });
};

export const getChatCollection = async (type = 'generalChat') => {
  return new Promise(async (resolve, reject) => {
    try {
      const findType =
        type === 'generalChat'
          ? CHAT
          : type === 'Art'
          ? ART
          : type === 'Code'
          ? CODE
          : type === 'Booking'
          ? BOOKING
          : type === 'Content'
          ? CONTENT
          : type === 'Health'
          ? HEALTH
          : type === 'Translate'
          ? TRANSLATE
          : type === 'Music'
          ? MUSIC
          : type === 'Movies'
          ? MOVIES
          : CHAT;
      const currentUserId = await getAuthUserId();
      const queryMessage = await db
        .collection(findType)
        .doc(`${currentUserId}-AI`)
        .collection(`${currentUserId}-AI`)
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot: any) => {
          return querySnapshot?._docs;
        });
      resolve(queryMessage);
    } catch (error) {}
  });
};

export const uploadImage = async (userId: any, imgResponse: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const storageRef = createImageStorageRef(userId, imgResponse);
      const imagePath = getFileLocalPath(imgResponse);
      const uploadTask = storageRef.putFile(imagePath);

      uploadTask.on('state_changed', null, reject, async () => {
        try {
          const downloadedURL = await storageRef.getDownloadURL();
          resolve(downloadedURL);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const initFirebase = () => {
  messaging().onMessage(localNotifications);
  messaging()
    .getInitialNotification()
    .then(notificationOpen => {
      if (notificationOpen) {
        console.log(notificationOpen);
      }
    });
};

export const createUser = async (userCollection: any, confirmation: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fcmToken = await getFCMToken();
      const url: string =
        userCollection?.userImageUrl &&
        (await uploadImage(
          confirmation?.user?.uid,
          userCollection?.userImageUrl,
        ));
      await db
        .collection(USERS)
        .doc(confirmation?.user?.uid)
        .set({...userCollection, userImageUrl: url, fcmToken: fcmToken})
        .then((response: any) => resolve(response))
        .catch((err: any) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const setCollectionData = async (
  storeData: any,
  collectionName: string,
  docName?: any,
) => {
  try {
    const currentUserId = await getAuthUserId();
    await db
      .collection(collectionName)
      .doc(docName ? docName : currentUserId)
      .update(storeData);
  } catch (error) {
    console.log('Error while to update document', error);
  }
};

/**
 * Create reference of the bucket for uploading user image to the bucket at the reference location.
 * Returns a reference to a image storage path.
 *
 * @param userId A slash-separated path(documentPath) to a document.
 * @param imgResponse An object containing image's fields and values with which to upload to the bucket.
 */
export const createImageStorageRef = (userId: any, imgResponse: any) => {
  const name =
    imgResponse.fileName ||
    imgResponse.name ||
    imgResponse.path ||
    imgResponse.uri;
  const extension = name.split('.').pop();
  const path = `${imageStoragePath(userId)}/${'user_pic'}.${extension}`;
  return dbStorage.ref(path);
};

/**
 * Returns a local storage file path.
 */
export const getFileLocalPath = (response: any) => {
  const {uri, sourceURL} = response;
  return Platform.OS === 'android' ? uri : `file:///${uri}`;
};

/**
 * Sign the user out of their current authentication state.
 */
export const logoutUser = () => {
  return new Promise((resolve: any, reject: any) => {
    console.log('called');
    firebaseAuth
      .signOut()
      .then(() => {
        resolve();
      })
      .catch((err: any) => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Push-notification set-up
 */
PushNotification.createChannel(
  {
    channelId: 'Synthia AI Chat',
    channelName: 'Synthia AI Chat channel',
    channelDescription: 'A channel to categories your notifications',
    playSound: true,
    importance: 4,
    vibrate: true,
  },
  (created: any) => console.log(`createChannel returned '${created}'`),
);

PushNotification.configure({
  onRegister: function (token: any) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification: any) {
    console.log('NOTIFICATION ------:', notification);
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  onAction: function (notification: any) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function (err: any) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

export const localNotifications = (remoteMessage: any) => {
  const {notification, data, messageId} = remoteMessage;

  PushNotification.localNotification({
    channelId: 'Synthia AI Chat',
    largeIcon: '',
    smallIcon: notification?.android?.smallIcon,
    bigPictureUrl: notification.imageUrl,
    bigText: notification.body || '',
    subText: notification.title,
    title: notification.title,
    message: notification.body || '',
    userInfo: data,
    messageId,
    priority: 'high',
    importance: 'high',
    visibility: 'public',
    allowWhileIdle: true,
    invokeApp: false,
    ignoreInForeground: false,
    usesChronometer: true,
    vibration: 300,
  });
};

/**
 * Firebase authentication error handler.
 *
 * @param error An Object containing FirebaseAuthTypes.PhoneAuthError.
 * @param errorHandler A callback to be called if the authentication fails.
 */
export function handleAuthError(error: any, errorHandler: any) {
  switch (error.code) {
    case 'auth/account-exists-with-different-credential':
    case 'auth/email-already-in-use':
      errorHandler('There already exists an account with this email address.');
      break;
    case 'auth/invalid-email':
      errorHandler('Please enter a valid email address.');
      break;
    case 'auth/invalid-credential':
      errorHandler('Your credentials are invalid or expired.');
      break;
    case 'auth/user-disabled':
      errorHandler('Your account has been disabled.');
      break;
    case 'auth/operation-not-allowed':
      console.info(
        'The type of account corresponding to the credential is not enabled. Enable the account type in the Firebase Console, under the Auth tab.',
      );
      errorHandler(
        'These type of accounts are not enabled for this app by the developer. More info is available in the console output.',
      );
      break;
    case 'auth/user-disabled':
      errorHandler('This account has been disabled.');
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      errorHandler('No user found or wrong password.');
      break;
    case 'auth/invalid-verification-code':
      errorHandler(
        'Unable to sign you in, the verification code is invalid. Please try again.',
      );
      break;
    case 'auth/invalid-verification-id':
      errorHandler(
        'Unable to sign you in, the verification ID is invalid. Please try again.',
      );
      break;
    case 'auth/invalid-phone-number':
      errorHandler('Please enter a valid phone number.');
      break;
    case 'auth/requires-recent-login':
      errorHandler('Please re-login.');
      break;
    case 'auth/missing-phone-number':
      errorHandler('Please enter a phone number.');
      break;
    case 'auth/quota-exceeded':
      errorHandler('This app has exceeded its SMS quota.');
      break;
    case 'auth/network-request-failed':
      errorHandler('Please check your network connection and try again');
      break;
    default:
      errorHandler(error.message);
      console.log(error);
      break;
  }
}
