import { uuidv4 } from 'src/utils/uuidv4';
import { fSub } from 'src/utils/format-time';
import { IChatParticipant, IUserChatMessage } from '../types/IChatTypes';

// ----------------------------------------------------------------------

type Props = {
  sender_uuid: IChatParticipant;
  receiver_uuid: IChatParticipant;
  recipients: IChatParticipant[];
  message?: string;
};

// export function initialConversation({ message = '', recipients, me }: Props) {
//   const isGroup = recipients.length > 1;

//   const messageData = {
//     id: uuidv4(),
//     attachments: [],
//     body: message,
//     contentType: 'text',
//     createdAt: fSub({ minutes: 1 }),
//     senderId: me.user_uuid,
//   };

//   const conversationData = {
//     id: isGroup ? uuidv4() : recipients[0]?.user_uuid,
//     messages: [messageData],
//     participants: [...recipients, me],
//     type: isGroup ? 'GROUP' : 'ONE_TO_ONE',
//     unreadCount: 0,
//   };

//   return { messageData, conversationData };
// }


type ICreateMessgae = {
  sender_uuid: string;
  receiver_uuid: string;
  conversation_uuid: string | null
  message: string;
};

export function initialChatConversation({ sender_uuid, receiver_uuid, message }: ICreateMessgae): IUserChatMessage {
  return {
    messages_uuid: null,
    conversation_uuid: null,
    sender_uuid: sender_uuid,
    sender_type: "EMPLOYEE",
    receiver_uuid: receiver_uuid,
    receiver_type: "EMPLOYEE",
    message: message,
    attachment: null,
    is_read: false,
    status: "ACTIVE"
  };
}