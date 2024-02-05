import {createContext, useState} from 'react';
import {
  getChatCollection,
  getUserData,
  handleAuthError,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  storeChatCommunication,
} from '../utils/Firebase';
import NavigationService from '../routes/NavigationService';
import {Alert} from 'react-native';

export const AppContext = createContext({});

export const ContextProvider = ({children}: any) => {
  const [authUser, setAuthUser] = useState<any>();

  return (
    <AppContext.Provider
      value={{
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
              Alert.alert('Synthia AI Chat', message);
            });
          }
        },
        loginUser: async (email: string, password: string) => {
          try {
            const confirmation = await signInWithEmailPassword(email, password);
            return confirmation;
          } catch (e) {
            handleAuthError(e, (message: any) => {
              Alert.alert('Synthia AI Chat', message);
            });
          }
        },
        fetchCurrentUserData: async () => {
          try {
            const userCollection: any = await getUserData(authUser?.uid);
            setAuthUser(userCollection?._data);
          } catch (e) {
            handleAuthError(e, (message: any) => {
              Alert.alert('Synthia AI Chat', message);
            });
          }
        },
        storeChat: async (message: any, collectionType: string) => {
          try {
            await storeChatCommunication(message, collectionType);
          } catch (e: any) {
            handleAuthError(e, (message: any) => {
              Alert.alert('Synthia AI Chat', message);
            });
          }
        },
        getChatCollectionData: async (collectionType: string) => {
          try {
            const collectionData: any = await getChatCollection(collectionType);
            return collectionData?.map((singleData: any) => {
              return singleData?._data;
            });
          } catch (error) {}
        },
      }}>
      {children}
    </AppContext.Provider>
  );
};
