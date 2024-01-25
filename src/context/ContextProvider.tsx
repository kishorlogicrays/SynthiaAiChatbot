import {createContext, useState} from 'react';

export const AppContext = createContext({});

export const ContextProvider = ({children}: any) => {
  const [authUser, setAuthUser] = useState();

  return (
    <AppContext.Provider
      value={{
        authUser,
        setAuthUser,
      }}>
      {children}
    </AppContext.Provider>
  );
};
