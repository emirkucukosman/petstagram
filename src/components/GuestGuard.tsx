import React from "react";
import { useReduxSelector } from "src/app/hook";
import { selectIsAuthenticated } from "src/slices/authSlice";
import { Redirect } from "react-router-dom";

type GuestGuardProps = {
  children: React.ReactNode;
};

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
};

export default GuestGuard;
