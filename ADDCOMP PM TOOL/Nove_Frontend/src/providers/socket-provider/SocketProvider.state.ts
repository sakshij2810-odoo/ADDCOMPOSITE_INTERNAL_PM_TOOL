import { ISocketContextState } from "./SocketProvider.types";

export const defaultSocketContextState: ISocketContextState = {
  socket: null,

  contacts: [],

  notifications: [],
  clearAllChatNotifications: () => { },
  clearSingleChatNotification: (uuid: string) => { },

  participiants: [],
  selectedParticipiant: null,
  onRefresh: () => { },
  onAddNewParticipant: () => { },
  onParticipantChange: () => { },


  messages: [],
  onAddNewMessage: () => { },
  onNotificationClick: () => { }
};
