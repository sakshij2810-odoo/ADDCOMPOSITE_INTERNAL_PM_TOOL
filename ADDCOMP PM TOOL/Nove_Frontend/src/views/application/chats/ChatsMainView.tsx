import { useCallback, useState } from 'react'
import { useAuthContext } from 'src/auth/hooks';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useCollapseNav } from './components/hooks/use-collapse-nav';
import { DashboardContent } from 'src/layouts/dashboard';
import { Typography } from '@mui/material';
import { Layout } from './components/layout';
import { ChatHeaderDetail } from './components/chat-header-detail';
import { ChatNav } from './components/chat-nav';
import { ChatMessageList } from './components/chat-message-list';
import { EmptyContent } from 'src/components/empty-content';
import { CONFIG } from 'src/config-global';
import { ChatMessageInput } from './components/chat-message-input';
import { useGetConversations, useGetMessagess, useGetParticipents } from './components/hooks/use-chat';
import { IChatParticipant, IUserChatMessage } from './components/types/IChatTypes';
import { useSocketContext } from 'src/providers';

const ChatsMainView = () => {
    const router = useRouter();
    const { user } = useAuthContext();
    const searchParams = useSearchParams();
    const selectedConversationId = searchParams.get('id') || '';

    const { contacts, selectedParticipiant, messages, onAddNewParticipant,
        onParticipantChange, onAddNewMessage, participiants
    } = useSocketContext();

    const roomNav = useCollapseNav();

    const conversationsNav = useCollapseNav();

    const handleUserSelect = (selected: IChatParticipant) => {
        if (selectedParticipiant && selectedParticipiant.user_uuid === selected.user_uuid) {
            onParticipantChange(null)
        } else if (selected.conversation?.conversation_uuid) {
            onParticipantChange(selected)
        } else {
            onAddNewParticipant(selected)
        }
    }


    const handleAddNewMessage = (message: IUserChatMessage) => {
        onAddNewMessage(message)
        if (selectedParticipiant && !selectedParticipiant.conversation?.conversation_uuid) {
            onParticipantChange({
                ...selectedParticipiant,
                conversation: {
                    conversation_uuid: message.conversation_uuid as string,
                    last_messsage: message.message,
                    attachment: null
                }

            })
        }

    }

    console.log("chatParticipants ==>", { participiants, messages, selectedParticipiant })
    return (
        <DashboardContent
            maxWidth={false}
            sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
        >
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Chat
            </Typography>

            <Layout
                sx={{
                    minHeight: 0,
                    flex: '1 1 0',
                    borderRadius: 2,
                    position: 'relative',
                    bgcolor: 'background.paper',
                    boxShadow: (theme) => theme.customShadows.card,
                }}
                slots={{
                    header: selectedParticipiant ? (
                        <ChatHeaderDetail
                            selectedParticipent={selectedParticipiant}
                            collapseNav={roomNav}
                            participants={participiants}
                            loading={false}
                        />
                    ) : (
                        // <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
                        <></>
                    ),
                    nav: (
                        <ChatNav
                            contacts={contacts}
                            chats={participiants}
                            loading={false}
                            selectedParticipent={selectedParticipiant}
                            collapseNav={conversationsNav}
                            onSelect={handleUserSelect}
                        />
                    ),
                    main: (
                        <>
                            {selectedParticipiant ? (
                                <ChatMessageList
                                    messages={messages ?? []}
                                    participants={participiants}
                                    loading={false}
                                />
                            ) : (
                                <EmptyContent
                                    imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                                    title="Good morning!"
                                    description="Write something awesome..."
                                />
                            )}

                            <ChatMessageInput
                                selectedParticipent={selectedParticipiant}
                                onAddRecipients={() => { }}
                                disabled={!selectedParticipiant}
                                onCreateMessageSuccess={handleAddNewMessage}
                            />
                        </>
                    ),
                    details: selectedConversationId && (
                        // 
                        <></>
                    ),
                }}
            />
        </DashboardContent>
    );
}

export default ChatsMainView