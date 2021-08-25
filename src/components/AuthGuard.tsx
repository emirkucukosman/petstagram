import React from "react";
import { useReduxSelector } from "src/app/hook";
import { selectIsAuthenticated } from "src/slices/authSlice";
import { Redirect } from "react-router-dom";

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
