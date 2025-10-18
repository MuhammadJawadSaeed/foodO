import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

// Connect socket to backend server (port 8000)
const socketUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
console.log("Socket connecting to:", socketUrl);
const socket = io(socketUrl);

const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Basic connection logic
    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
