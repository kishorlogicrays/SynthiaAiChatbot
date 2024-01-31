import {createContext, useState} from 'react';
import {
  createUser,
  handleAuthError,
  signInWithEmailPassword,
  signUpWithEmailPassword,
} from '../utils/Firebase';
import NavigationService from '../routes/NavigationService';
import {Alert} from 'react-native';

export const AppContext = createContext({});

export const ContextProvider = ({children}: any) => {
  const [authUser, setAuthUser] = useState();

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
      }}>
      {children}
    </AppContext.Provider>
  );
};
