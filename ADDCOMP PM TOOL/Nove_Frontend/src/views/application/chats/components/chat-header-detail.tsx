import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useResponsive } from 'src/hooks/use-responsive';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ChatHeaderSkeleton } from './chat-skeleton';

import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import { IChatParticipant } from './types/IChatTypes';
import { useSearchParamsV2 } from 'src/routes/hooks/use-search-params';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  selectedParticipent: IChatParticipant | null,
  participants: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
};

export function ChatHeaderDetail({ collapseNav, selectedParticipent, loading }: Props) {
  const popover = usePopover();
  const lgUp = useResponsive('up', 'lg');

  const { collapseDesktop, onCollapseDesktop, onOpenMobile } = collapseNav;

  const handleToggleNav = useCallback(() => {
    if (lgUp) {
      onCollapseDesktop();
    } else {
      onOpenMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lgUp]);


  const renderSingle = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Badge
        variant={selectedParticipent?.is_online ? "online" : "offline"}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={selectedParticipent?.avatar_url ? selectedParticipent?.avatar_url : selectedParticipent?.user_name?.charAt(0)?.toUpperCase()} alt={selectedParticipent?.user_name} />
      </Badge>

      <ListItemText
        primary={selectedParticipent?.user_name}
        secondary={
          selectedParticipent?.is_online ? 'online'
            : selectedParticipent?.lastOnlineAt
        }
        secondaryTypographyProps={{
          component: 'span',
          ...(!selectedParticipent?.is_online && { textTransform: 'capitalize' }),
        }}
      />
    </Stack>
  );

  if (loading) {
    return <ChatHeaderSkeleton />;
  }

  return (
    <>
      {renderSingle}

      <Stack direction="row" flexGrow={1} justifyContent="flex-end">
        <IconButton>
          <Iconify icon="solar:phone-bold" />
        </IconButton>

        <IconButton>
          <Iconify icon="solar:videocamera-record-bold" />
        </IconButton>

        <IconButton onClick={handleToggleNav}>
          <Iconify icon={!collapseDesktop ? 'ri:sidebar-unfold-fill' : 'ri:sidebar-fold-fill'} />
        </IconButton>

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:bell-off-bold" />
            Hide notifications
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:forbidden-circle-bold" />
            Block
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:danger-triangle-bold" />
            Report
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
