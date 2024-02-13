import {createContext, useState} from 'react';
import {
  getChatCollection,
  getUserData,
  handleAuthError,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  storeChatCommunication,
} from '../utils/Firebase';
import {Alert} from 'react-native';
import {firebase} from '@react-native-firebase/auth';

export const AppContext = createContext({});

export const ContextProvider = ({children}: any) => {
  const [authUser, setAuthUser] = useState<any>();
  const [aiAPIKey, setAiAPIKey] = useState<string>('');
  const [adsDetails, setAdsDetails] = useState<any>({});

  return (
    <AppContext.Provider
      value={{
        aiAPIKey,
        setAiAPIKey,
        adsDetails,
        setAdsDetails,
        authUser,
        setAuthUser,
        signUpUser: async (email: string, password: string) => {
          try {
            const confirmation: any = await signUpWithEmailPassword(
              email,
              password,
            );
            return confirmation;
          } catch (e: any) {
            handleAuthError(e, (message: any) => {
              Alert.alert('AI Monk', message);
            });
            return e;
          }
        },
        loginUser: async (email: string, password: string) => {
          try {
            const confirmation = await signInWithEmailPassword(email, password);
            return confirmation;
          } catch (e) {
            handleAuthError(e, (message: any) => {
              Alert.alert('AI Monk', message);
            });
            return e;
          }
        },
        fetchCurrentUserData: async () => {
          try {
            const userCollection: any = await getUserData(authUser?.uid);
            setAuthUser(userCollection?._data);
          } catch (e) {
            handleAuthError(e, (message: any) => {
              Alert.alert('AI Monk', message);
            });
            return e;
          }
        },
        storeChat: async (message: any, collectionType: string) => {
          try {
            await storeChatCommunication(message, collectionType);
          } catch (e: any) {
            handleAuthError(e, (message: any) => {
              Alert.alert('AI Monk', message);
            });
            return e;
          }
        },
        getChatCollectionData: async (collectionType: string) => {
          try {
            const collectionData: any = await getChatCollection(collectionType);
            return collectionData?.map((singleData: any) => {
              return singleData?._data;
            });
          } catch (e) {
            return e;
          }
        },
        sendResetLink: async (email: string) => {
          try {
            await firebase.auth().sendPasswordResetEmail(email);
          } catch (e) {
            handleAuthError(e, (message: any) => {
              Alert.alert('AI Monk', message);
            });
            return e;
          }
        },
      }}>
      {children}
    </AppContext.Provider>
  );
};
