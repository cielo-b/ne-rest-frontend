import { useSelector } from "react-redux";
import { RootState } from "../store";
import { JSX } from "react";
import { Navigate } from "react-router-dom";

const AuthRegisterProtected = ({ children }: { children: JSX.Element }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  return !token ? children : <Navigate to="/dashboard" replace />;
};
export default AuthRegisterProtected;
