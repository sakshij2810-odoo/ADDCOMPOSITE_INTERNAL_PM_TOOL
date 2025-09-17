
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { main_app_routes, paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { today } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useAuthContext, useMockedUser } from 'src/auth/hooks';

import { ToggleButton } from './styles';
import { ChatNavItem } from './chat-nav-item';
import { ChatNavAccount } from './chat-nav-account';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ChatNavSearchResults } from './chat-nav-search-results';
import type { UseNavCollapseReturn } from './hooks/use-collapse-nav';
import { IChatConversations, IChatParticipant } from './types/IChatTypes';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  loading: boolean;
  chats: IChatParticipant[]
  contacts: IChatParticipant[];
  collapseNav: UseNavCollapseReturn;
  selectedParticipent: IChatParticipant | null;
  onSelect: (user: IChatParticipant) => void
};

export function ChatNav({
  loading,
  contacts,
  collapseNav,
  // conversations,
  // selectedConversationId,
  chats,
  selectedParticipent,
  onSelect
}: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { user } = useAuthContext();

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;

  const [searchContacts, setSearchContacts] = useState<{
    query: string;
    results: IChatParticipant[];
  }>({
    query: '',
    results: [],
  });

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const handleClickCompose = useCallback(() => {
    if (!mdUp) {
      onCloseMobile();
    }
    router.push(paths.dashboard.chat);
  }, [mdUp, onCloseMobile, router]);

  const handleSearchContacts = useCallback(
    (inputValue: string) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        const results = contacts.filter((contact) =>
          contact.user_name.toLowerCase().includes(inputValue)
        );

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  // const handleClickResult = useCallback(
  //   async (result: IChatParticipant) => {
  //     handleClickAwaySearch();

  //     const linkTo = (id: string) => router.push(`${main_app_routes.app.chats}?id=${id}`);

  //     try {
  //       // Check if the conversation already exists
  //       // if (conversations.allIds.includes(result.user_uuid)) {
  //       //   linkTo(result.user_uuid);
  //       //   return;
  //       // }

  //       // Find the recipient in contacts
  //       const recipient = contacts.find((contact) => contact.user_uuid === result.user_uuid);
  //       if (!recipient) {
  //         console.error('Recipient not found');
  //         return;
  //       }

  //       // Prepare conversation data
  //       const { conversationData } = initialConversation({
  //         recipients: [recipient],
  //         me: myContact,
  //       });

  //       // Create a new conversation
  //       const res = await createConversation(conversationData);

  //       if (!res || !res.conversation) {
  //         console.error('Failed to create conversation');
  //       }

  //       // Navigate to the new conversation
  //       linkTo(res.conversation.id);
  //     } catch (error) {
  //       console.error('Error handling click result:', error);
  //     }
  //   },
  //   [contacts, handleClickAwaySearch, myContact, router]
  // );

  const renderLoading = <ChatNavItemSkeleton />;

  const renderList = (
    <nav>
      <Box component="ul">
        {chats.map((chat) => (
          <ChatNavItem
            key={chat.user_uuid}
            collapse={collapseDesktop}
            participant={chat}
            selected={chat.user_uuid === selectedParticipent?.user_uuid}
            onCloseMobile={onCloseMobile}
            onSelect={onSelect}
          />
        ))}
      </Box>
    </nav>
  );

  const renderListResults = (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={onSelect}
    />
  );

  const renderSearchInput = (
    <ClickAwayListener onClickAway={handleClickAwaySearch}>
      <TextField
        fullWidth
        value={searchContacts.query}
        onChange={(event) => handleSearchContacts(event.target.value)}
        placeholder="Search contacts..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );

  const renderContent = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ p: 2.5, pb: 0 }}>
        {!collapseDesktop && (
          <>
            <ChatNavAccount />
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}

        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
          />
        </IconButton>

        {!collapseDesktop && (
          <IconButton onClick={handleClickCompose}>
            <Iconify width={24} icon="solar:user-plus-bold" />
          </IconButton>
        )}
      </Stack>

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput}</Box>

      {loading ? (
        renderLoading
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {/* {searchContacts.query && !!conversations.allIds.length ? renderListResults : renderList} */}
          {searchContacts.query ? renderListResults : renderList}
        </Scrollbar>
      )}
    </>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>

      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', md: 'flex' },
          borderRight: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
        }}
      >
        {renderContent}
      </Stack>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
