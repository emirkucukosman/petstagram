import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { authStateChanged, selectIsInitialised } from "src/slices/authSlice";
import { auth } from "src/firebase";
import LoadingScreen from "./LoadingScreen";

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useReduxDispatch();
  const isInitialised = useReduxSelector(selectIsInitialised);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((fbUser) => {
      if (fbUser) {
        const user = {
          id: fbUser.uid,
          email: fbUser.email!,
          username: fbUser.displayName,
          photoURL: fbUser.photoURL,
        };
        dispatch(authStateChanged({ isAuthenticated: true, user }));
      } else {
        dispatch(authStateChanged({ isAuthenticated: false, user: null }));
      }
    });

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isInitialised) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default AuthProvider;
