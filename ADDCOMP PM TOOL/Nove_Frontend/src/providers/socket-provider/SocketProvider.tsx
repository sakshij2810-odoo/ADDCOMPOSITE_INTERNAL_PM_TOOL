import React, { useEffect } from "react";
import { ISocket } from "./SocketProvider.types";
import { SocketContext } from "./SocketProvider.context";
import { initializeSocket } from "./SocketProvider.utils";
import { useAuthContext } from "src/auth/hooks";
import { IUserProfile } from "src/redux";
import { getChatUsersAsync } from "./SocketProvider.services";
import { LinearProgress } from "@mui/material";
import { IChatParticipant } from "src/views/application/chats/components/types/IChatTypes";
import { useChatNotifications } from "./SocketProvider.hooks";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = (
  props,
) => {
  const [appSocket, setAppSocket] = React.useState<ISocket>(null);
  const [loading, setLoading] = React.useState(false);
  const { user: { user_uuid } } = useAuthContext();


  useEffect(() => {
    if (!user_uuid) return; // ✅ Don't init socket without user_uuid
    const newSocket = initializeSocket(user_uuid);

    newSocket.on("connect", () => {
      setAppSocket(newSocket);
      console.log("✅ Socket connected:", newSocket.connected, newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // Optional: Handle connection errors
    newSocket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message);
    });

    return () => {
      newSocket.disconnect(); // ✅ Cleanup on unmount
    }
  }, [user_uuid]);
  const chatHookValues = useChatNotifications(appSocket);


  if ((user_uuid && !appSocket)) return <LinearProgress />;

  console.log("chatHookValues =>", chatHookValues.notifications)

  return (
    <SocketContext.Provider value={{
      socket: appSocket,
      ...chatHookValues
    }}>
      {props.children}
    </SocketContext.Provider>
  );
};
