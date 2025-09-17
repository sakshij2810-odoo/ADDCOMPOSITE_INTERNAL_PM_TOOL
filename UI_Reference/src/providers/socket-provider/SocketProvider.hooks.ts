import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SocketContext } from "./SocketProvider.context";
import { ISocket } from "./SocketProvider.types";
import { IChatParticipant, IGetParticipantOnlineStatus, IGetUserMessage, IUserChatConversation, IUserChatMessage } from "src/views/application/chats/components/types/IChatTypes";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { convertDaumToChatParticipants } from "src/views/application/chats/components/hooks/use-chat";
import { produce } from "immer";
import { convertChatNotificationsToMessages, convertChatNotificationsToParticipant, sortChatMessgaesByDateAsc } from "./SocketProvider.utils";
import { IUserProfile } from "src/redux";
import { useAuthContext } from "src/auth/hooks";
import moment from "moment";
import { useRouter } from "src/routes/hooks";
import { main_app_routes } from "src/routes/paths";

export function useSocketContext() {
  const context = React.useContext(SocketContext);
  if (!context) throw new Error("SocketContext: Context must be used inside AuthProvider");
  return context;
}

const CHAT_ENDPOINT = server_base_endpoints.conversations;
const CONTACT_ENDPOINT = server_base_endpoints.users;

const initialConversationState = {
  participiants: [],
  selected: null,
  messages: [],
  contacts: []
};

export const useChatNotifications = (socket: ISocket) => {
  const { user: { user_uuid: login_user_uuid } } = useAuthContext();
  const router = useRouter()

  const [chatNotifications, setChatNotifications] = useState<IGetUserMessage[]>([]);
  const [allParticipants, setAllParticipants] = useState<{
    participiants: IChatParticipant[];
    selected: IChatParticipant | null;
    messages: IUserChatMessage[];
    contacts: IChatParticipant[];
  }>(initialConversationState);

  // Function hoisted so it's available before useMemo and others
  const fetchUserConversations = useCallback((user_uuid: string) => {
    axios_base_api
      .get(CHAT_ENDPOINT.get_conversation, { params: { user_uuid } })
      .then((res) => {
        const result = res.data.data as IUserChatConversation[];
        setAllParticipants((prev) => ({
          ...prev,
          participiants: convertDaumToChatParticipants(user_uuid, result)
        }));
      })
      .catch((error) => console.error("fetchUserConversations Error: ", error));
  }, []);

  // Fetch user contacts once on mount
  useEffect(() => {
    if (!login_user_uuid) return;
    const fetchUserProfilesAsync = () => {
      axios_base_api
        .get(CONTACT_ENDPOINT.get_users)
        .then((res) => {
          const participants = (res.data.data as IUserProfile[] || []).map((user) => ({
            user_uuid: user.user_uuid,
            user_name: `${user.first_name} ${user.last_name || ""}`.trim(),
            user_role: user.role_value,
            user_email: user.email,
            avatar_url: user.photo,
            phone_number: user.mobile,
            status: "online"
          })) as IChatParticipant[];

          setAllParticipants((prev) => ({
            ...prev,
            contacts: participants.filter((c) => c.user_uuid !== login_user_uuid)
          }));
        })
        .catch((error) => console.error("fetchUserProfilesAsync Error: ", error));
    };

    fetchUserProfilesAsync();
  }, [login_user_uuid]);

  // Fetch user conversations on login
  useEffect(() => {
    if (login_user_uuid) {
      fetchUserConversations(login_user_uuid);
    } else {
      setAllParticipants(initialConversationState);
    }
  }, [login_user_uuid, fetchUserConversations]);

  // Fetch messages when selected conversation changes
  useEffect(() => {
    const fetchUserChatMessages = (uuid: string) => {
      axios_base_api
        .get(CHAT_ENDPOINT.get_messages, { params: { conversation_uuid: uuid } })
        .then((res) => {
          setAllParticipants((prev) => ({ ...prev, messages: res.data.data }));
        })
        .catch((error) => console.error("fetchUserChatMessages Error: ", error));
    };

    const uuid = allParticipants.selected?.conversation?.conversation_uuid;
    if (uuid) {
      fetchUserChatMessages(uuid);
    } else {
      setAllParticipants((prev) => ({ ...prev, messages: [] }));
    }
  }, [allParticipants.selected?.conversation?.conversation_uuid]);

  // Handle socket new message events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: IGetUserMessage) => {
      let shouldAddNotification = false;
      setAllParticipants((prev) => {

        const isCurrentConversation = prev.selected?.conversation?.conversation_uuid === data.conversation_uuid
        if (!isCurrentConversation) {
          setChatNotifications((prevNotifs) => [data, ...prevNotifs]);
        }

        const index = prev.participiants.findIndex((ps) => ps.conversation?.conversation_uuid === data.conversation_uuid);

        if (index > -1) {
          const updatedParticipants = produce(prev.participiants, (draft) => {
            const participant = draft[index];
            if (participant?.conversation) {
              participant.conversation.last_messsage = data.message;
            }
          });
          return {
            ...prev,
            participiants: updatedParticipants,
            messages: isCurrentConversation
              ? [...prev.messages, convertChatNotificationsToMessages([data])[0]]
              : prev.messages,
          };
        } else if (index === -1) {
          return {
            ...prev,
            participiants: [convertChatNotificationsToParticipant(data), ...prev.participiants],
          };
        }

        // Message from a different conversation, flag it for notification
        if (!prev.selected || prev.selected.conversation?.conversation_uuid !== data.conversation_uuid
        ) {
          shouldAddNotification = true;
        }


        return prev;
      });

      if (shouldAddNotification) {
        setChatNotifications((prevNotifs) => [data, ...prevNotifs]);
      }
    };

    const handleParticipiantStatus = (status: IGetParticipantOnlineStatus) => {
      const { user_uuid, isOnline, timestamp } = status;
      const lastOnline = moment(timestamp).fromNow()
      setAllParticipants((prev) => {
        const updatedParticipants = prev.participiants.map((ps) =>
          ps.user_uuid === user_uuid ? { ...ps, is_online: isOnline, lastOnlineAt: lastOnline } : ps
        );

        const updatedSelected =
          prev.selected?.user_uuid === user_uuid
            ? { ...prev.selected, is_online: isOnline, lastOnline }
            : prev.selected;
        return {
          ...prev,
          participiants: updatedParticipants,
          selected: updatedSelected
        };
      });
    };
    socket.on("user_status", handleParticipiantStatus);

    socket.on("conversation:new_message", handleNewMessage);

    // return () => {
    //   socket.off("conversation:new_message", handleNewMessage);
    // };
  }, [socket]);

  // Utility functions
  const onAddNewParticipant = (new_ps: IChatParticipant) => {
    setAllParticipants((prev) => ({
      ...prev,
      participiants: [new_ps, ...prev.participiants],
      selected: new_ps
    }));
  };

  const onParticipantChange = (ps: IChatParticipant | null) => {
    setAllParticipants((prev) => ({ ...prev, selected: ps }));
  };

  const clearSingleChatNotification = (message_uuid: string) => {
    setChatNotifications((prev) =>
      prev.filter((msg) => msg.messages_uuid !== message_uuid)
    );
  };

  const onAddNewMessage = (message: IUserChatMessage) => {
    setAllParticipants((prev) => {
      const isNewUser = !prev.selected?.conversation?.conversation_uuid;

      const updatedConversation: IChatParticipant["conversation"] = {
        conversation_uuid: message.conversation_uuid as string,
        attachment: message.attachment,
        last_messsage: message.message
      };

      const updatedParticipants = isNewUser
        ? prev.participiants.map((prs) =>
          prs.user_uuid === message.receiver_uuid
            ? { ...prs, conversation: updatedConversation }
            : prs
        )
        : prev.participiants;

      const updatedSelected = isNewUser && prev.selected
        ? {
          ...prev.selected,
          conversation: updatedConversation
        }
        : prev.selected;

      return {
        ...prev,
        participiants: updatedParticipants,
        selected: updatedSelected,
        messages: [...prev.messages, message]
      };
    });
  }

  const onNotificationClick = (message: IGetUserMessage) => {
    setChatNotifications((prev) => prev.filter((nf) => nf.messages_uuid !== message.messages_uuid))
    setAllParticipants((prev) => {
      const index = prev.participiants.findIndex((ps) => ps.conversation?.conversation_uuid === message.conversation_uuid);

      return {
        ...prev,
        participiants: index > -1 ? produce(prev.participiants, (draft) => {
          const participant = draft[index];
          if (participant?.conversation) {
            participant.conversation.last_messsage = message.message;
          }
        }) : [convertChatNotificationsToParticipant(message), ...prev.participiants],
        selected: convertChatNotificationsToParticipant(message)
      }
    })
    router.push(main_app_routes.app.chats)
  }

  const memoizedReturn = useMemo(() => ({
    contacts: allParticipants.contacts,
    notifications: chatNotifications,
    clearAllChatNotifications: () => setChatNotifications([]),
    clearSingleChatNotification,

    participiants: allParticipants.participiants,
    selectedParticipiant: allParticipants.selected,
    onRefresh: () => login_user_uuid && fetchUserConversations(login_user_uuid),
    onAddNewParticipant,
    onParticipantChange,
    onNotificationClick,
    messages: sortChatMessgaesByDateAsc(allParticipants.messages),
    onAddNewMessage
  }), [
    chatNotifications,
    allParticipants,
    login_user_uuid,
    fetchUserConversations
  ]);
  return memoizedReturn;
}