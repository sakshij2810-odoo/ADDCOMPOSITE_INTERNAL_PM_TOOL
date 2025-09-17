import { Socket } from "socket.io-client";
import { IChatParticipant, IGetUserMessage, IUserChatMessage } from "src/views/application/chats/components/types/IChatTypes";


export type ISocket = Socket | null
export interface ISocketContextState {
  socket: ISocket;
  contacts: IChatParticipant[]

  notifications: IGetUserMessage[]
  clearAllChatNotifications: () => void
  clearSingleChatNotification: (uuid: string) => void

  participiants: IChatParticipant[],
  selectedParticipiant: IChatParticipant | null,
  onRefresh: () => void,
  onAddNewParticipant: (new_ps: IChatParticipant) => void,
  onParticipantChange: (new_ps: IChatParticipant | null) => void,


  messages: IUserChatMessage[],
  onAddNewMessage: (new_msg: IUserChatMessage) => void,

  onNotificationClick: (nf: IGetUserMessage) => void
}
