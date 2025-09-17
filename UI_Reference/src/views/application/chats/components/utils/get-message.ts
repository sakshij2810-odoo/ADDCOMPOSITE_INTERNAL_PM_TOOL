
// ----------------------------------------------------------------------

import { IUserChatMessage, IChatParticipant } from "../types/IChatTypes";

type Props = {
  currentUserId: string;
  message: IUserChatMessage;
  participants: IChatParticipant[];
};

export function getMessage({ message, participants, currentUserId }: Props) {
  const sender = participants.find((participant) => participant.user_uuid === message.sender_uuid);

  const isCurrentUser = message.sender_uuid === currentUserId;

  const senderDetails = isCurrentUser
    ? { type: 'me' }
    : {
      avatarUrl: sender?.avatar_url,
      firstName: sender?.user_name?.split(' ')[0] ?? 'Unknown',
    };

  const hasImage = message.attachment;

  return { hasImage, me: isCurrentUser, senderDetails };
}
