import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { main_app_routes, paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { IChatParticipant } from './types/IChatTypes';


// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  collapse: boolean;
  participant: IChatParticipant
  onCloseMobile: () => void;
  onSelect: (participant: IChatParticipant) => void
};

export function ChatNavItem({ selected, collapse, participant, onCloseMobile, onSelect }: Props) {
  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const { avatar_url, conversation, user_name, status, is_online, user_uuid: receiver_uuid } = participant


  const handleClickConversation = useCallback(async () => {
    if (!mdUp) {
      onCloseMobile();
    }

    onSelect(participant)
  }, [receiver_uuid, mdUp, onCloseMobile, router]);


  const renderSingle = (
    <Badge key={status} variant={is_online ? "online" : "offline"} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Avatar alt={user_name} src={avatar_url ? avatar_url : user_name?.charAt(0)?.toUpperCase()} sx={{ width: 48, height: 48 }} />
    </Badge>
  );

  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        onClick={handleClickConversation}
        sx={{
          py: 1.5,
          px: 2.5,
          gap: 2,
          ...(selected && { bgcolor: 'action.selected' }),
        }}
      >
        <Badge
          color="error"
          overlap="circular"
          badgeContent={collapse ? participant.status : 0}
        >
          {renderSingle}
        </Badge>

        {!collapse && (
          <>
            <ListItemText
              primary={user_name}
              primaryTypographyProps={{ noWrap: true, component: 'span', variant: 'subtitle2' }}
              secondary={conversation?.last_messsage}
              secondaryTypographyProps={{
                noWrap: true,
                component: 'span',
                // variant: conversation.unreadCount ? 'subtitle2' : 'body2',
                // color: conversation.unreadCount ? 'text.primary' : 'text.secondary',
              }}
            />

            <Stack alignItems="flex-end" sx={{ alignSelf: 'stretch' }}>
              <Typography
                noWrap
                variant="body2"
                component="span"
                sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
              >
                {/* {fToNow(lastActivity)} */}
              </Typography>

              {!!participant.status && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: 'info.main',
                    borderRadius: '50%',
                  }}
                />
              )}
            </Stack>
          </>
        )}
      </ListItemButton>
    </Box>
  );
}
