import { useState, useCallback } from 'react';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { CollapseButton } from './styles';
import { ChatRoomParticipantDialog } from './chat-room-participant-dialog';
import { IChatParticipant } from './types/IChatTypes';

// ----------------------------------------------------------------------

type Props = {
  participants: IChatParticipant[];
};

export function ChatRoomGroup({ participants }: Props) {
  const collapse = useBoolean(true);

  const [selected, setSelected] = useState<IChatParticipant | null>(null);

  const handleOpen = useCallback((participant: IChatParticipant) => {
    setSelected(participant);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  const totalParticipants = participants.length;

  const renderList = (
    <>
      {participants.map((participant) => (
        <ListItemButton key={participant.user_uuid} onClick={() => handleOpen(participant)}>
          <Badge
            variant={participant.status}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar alt={participant.user_name} src={participant.avatar_url} />
          </Badge>

          <ListItemText
            sx={{ ml: 2 }}
            primary={participant.user_name}
            secondary={participant.user_role}
            primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
            secondaryTypographyProps={{ noWrap: true, component: 'span', typography: 'caption' }}
          />
        </ListItemButton>
      ))}
    </>
  );

  return (
    <>
      <CollapseButton
        selected={collapse.value}
        disabled={!totalParticipants}
        onClick={collapse.onToggle}
      >
        {`In room (${totalParticipants})`}
      </CollapseButton>

      <Collapse in={collapse.value}>{renderList}</Collapse>

      {selected && (
        <ChatRoomParticipantDialog participant={selected} open={!!selected} onClose={handleClose} />
      )}
    </>
  );
}
