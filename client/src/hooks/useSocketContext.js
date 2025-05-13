import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);

  if (!ctx)
    throw new Error(
      "useSocketContext must be used within SocketContextProvider"
    );

  return {
    socket: ctx.socket,
  };
};
