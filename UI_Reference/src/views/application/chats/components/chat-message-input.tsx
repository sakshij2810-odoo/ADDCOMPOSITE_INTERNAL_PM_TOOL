import { useRef, useMemo, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { main_app_routes, paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { today } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useAuthContext, useMockedUser } from 'src/auth/hooks';

import { initialChatConversation } from './utils/initial-conversation';
import { IChatParticipant, IUserChatMessage } from './types/IChatTypes';
import { createNewMessageConversation } from './hooks/use-chat';

// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  selectedParticipent: IChatParticipant | null;
  onAddRecipients: (recipients: IChatParticipant[]) => void;
  onCreateMessageSuccess: (message: IUserChatMessage) => void
};

export function ChatMessageInput({
  disabled,
  onAddRecipients,
  selectedParticipent,
  onCreateMessageSuccess
}: Props) {

  const router = useRouter();
  const { user } = useAuthContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  // const messagePayload = initialChatConversation({
  //   sender_uuid: user.user_uuid,
  //   receiver_uuid: selectedParticipent?.user_uuid || '',
  //   conversation_uuid: selectedParticipent?.conversation_uuid || '',
  //   message,
  // });

  const messagePayload = useCallback(() => {
    return {
      messages_uuid: null,
      conversation_uuid: selectedParticipent?.conversation?.conversation_uuid || '',
      sender_uuid: user.user_uuid,
      sender_type: "EMPLOYEE",
      receiver_uuid: selectedParticipent?.user_uuid || '',
      receiver_type: "EMPLOYEE",
      message: message,
      attachment: null,
      is_read: false,
      status: "ACTIVE"
    } as IUserChatMessage
  }, [selectedParticipent])()

  console.log("ChatMessageInput messagePayload==>", messagePayload)

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter' || !message) return;
      try {
        if (selectedParticipent) {
          const messageRes = await createNewMessageConversation({
            ...messagePayload,
            message: message
          });
          onCreateMessageSuccess(messageRes);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setMessage('');
      }
    },
    [message, messagePayload, onAddRecipients, router, selectedParticipent]
  );

  return (
    <>
      <InputBase
        name="chat-message"
        id="chat-message-input"
        value={message}
        onKeyUp={handleSendMessage}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        disabled={disabled}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        // endAdornment={
        //   <Stack direction="row" sx={{ flexShrink: 0 }}>
        //     <IconButton onClick={handleAttach}>
        //       <Iconify icon="solar:gallery-add-bold" />
        //     </IconButton>
        //     <IconButton onClick={handleAttach}>
        //       <Iconify icon="eva:attach-2-fill" />
        //     </IconButton>
        //     <IconButton>
        //       <Iconify icon="solar:microphone-bold" />
        //     </IconButton>
        //   </Stack>
        // }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}
