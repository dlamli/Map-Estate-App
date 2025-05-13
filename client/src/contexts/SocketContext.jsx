import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "../hooks/useAuthContext";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [socket, setSocket] = useState(null);

  const currentUser = user.userInfo;

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    currentUser && socket?.emit("newUser", currentUser.id);
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
