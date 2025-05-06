import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";



export const useAuthContext = () => {
  const context = useContext(AuthContext);

  return {
    user: context.currentUser.userInfo,
    updateUser: context.updateUser
  };
};
