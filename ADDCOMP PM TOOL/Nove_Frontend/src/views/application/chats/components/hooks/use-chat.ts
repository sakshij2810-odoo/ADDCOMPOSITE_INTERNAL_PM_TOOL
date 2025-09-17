


import React, { useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';

import axios_base_api, { fetcherV2, server_base_endpoints } from 'src/utils/axios-base-api';
import { IChatConversation, IChatMessage, IChatParticipant, IUserChatConversation, IUserChatMessage } from '../types/IChatTypes';
import { IUserProfile } from 'src/redux';
import { produce } from 'immer';
import moment from 'moment';
import { useSocketContext } from 'src/providers';

// ----------------------------------------------------------------------

const enableServer = false;

const CHAT_ENDPOINT = server_base_endpoints.conversations;
const CONTACT_ENDPOINT = server_base_endpoints.users;

const swrOptions = {
    revalidateIfStale: enableServer,
    revalidateOnFocus: enableServer,
    revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type ContactsData = {
    data: IUserProfile[];
};

export function useGetParticipents() {
    const [allParticipants, setAllParticipants] = useState<IChatParticipant[]>([])

    React.useEffect(() => {
        fetchUserProfilesAsync();
    }, []);

    const fetchUserProfilesAsync = () => {
        axios_base_api.get(CONTACT_ENDPOINT.get_users).then((res) => {
            const participirnts = (res.data.data as IUserProfile[] || []).map((user) => ({
                user_uuid: user.user_uuid,
                user_name: (`${user.first_name} ${user.last_name || ""}`).trim(),
                user_role: user.role_value,
                user_email: user.email,
                avatar_url: user.photo,
                phone_number: user.mobile,
                status: 'online',
            })) as IChatParticipant[]
            setAllParticipants(participirnts)
        }).catch((error) => {
            console.error("createNewMessageConversation Error: ", error)
        })
    }

    const memoizedReturn = useMemo(() => {
        return {
            participants: allParticipants,
        };
    }, [allParticipants]);

    console.log("useGetParticipents memoizedReturn =>", memoizedReturn)
    return memoizedReturn
}

export function useGetContacts() {
    const { data, isLoading, error, isValidating } = useSWR<ContactsData>([CONTACT_ENDPOINT.get_users], fetcherV2, swrOptions);
    const memoizedValue = useMemo(() => ({
        contacts: (data?.data || []).map((user) => ({
            user_uuid: user.user_uuid,
            user_name: (`${user.first_name} ${user.last_name || ""}`).trim(),
            user_role: user.role_value,
            user_email: user.email,
            avatar_url: user.photo,
            phone_number: user.mobile,
            status: 'online',
        })) as IChatParticipant[],
        contactsLoading: isLoading,
        contactsError: error,
        contactsValidating: isValidating,
        contactsEmpty: !isLoading && !data?.data.length,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// // ----------------------------------------------------------------------

// type ConversationsData = {
//     data: IChatConversation[];
// };

// export function useGetConversations() {
//     const url = [CHART_ENDPOINT.get_messages];

//     const { data, isLoading, error, isValidating } = useSWR<ConversationsData>(
//         url,
//         fetcherV2,
//         swrOptions
//     );

//     const memoizedValue = useMemo(() => {
//         const byId = data?.data.length ? keyBy(data.data, 'id') : {};
//         const allIds = Object.keys(byId);

//         return {
//             conversations: { byId, allIds },
//             conversationsLoading: isLoading,
//             conversationsError: error,
//             conversationsValidating: isValidating,
//             conversationsEmpty: !isLoading && !allIds.length,
//         };
//     }, [data?.data, error, isLoading, isValidating]);

//     return memoizedValue;
// }

// ----------------------------------------------------------------------

type ConversationData = {
    data: IUserChatMessage[];
};

// export function useGetConversations(conversation_uuid: string | null) {

//     const url = conversation_uuid ? [CHART_ENDPOINT.get_messages, { params: { conversation_uuid } }] : null;

//     const { data, isLoading, error, isValidating } = useSWR<ConversationData>(url, fetcherV2, swrOptions);

//     const memoizedValue = useMemo(() => ({
//         conversation: data?.data ?? [],
//         conversationLoading: isLoading,
//         conversationError: error,
//         conversationValidating: isValidating,
//     }), [data?.data, error, isLoading, isValidating]);

//     return memoizedValue;
// }

export const convertDaumToChatParticipants = (login_user_uuid: string, data: IUserChatConversation[]): IChatParticipant[] => {
    return data.map((p_data) => {
        const [receiver] = p_data.participants.filter((item) => item.user_uuid !== login_user_uuid);

        return {
            user_uuid: receiver.user_uuid,
            user_name: receiver.user_name,
            user_role: receiver.user_role,
            user_email: receiver.user_email,
            avatar_url: receiver.avatar_url ?? '',
            phone_number: receiver.phone_number ?? '',
            is_online: receiver.is_online,
            lastOnlineAt: "",
            status: "online", // or dynamically assign based on your logic
            conversation: {
                conversation_uuid: p_data.conversation_uuid,
                last_messsage: p_data.last_message.message, // or assign from actual data if available
                attachment: null,
            },
        }
    });
}


const initialConversationState = {
    participiants: [],
    selected: null
}
export function useGetConversations(login_user_uuid: string | null) {
    const [allParticipants, setAllParticipants] = useState<{ participiants: IChatParticipant[], selected: IChatParticipant | null }>(initialConversationState)

    React.useEffect(() => {
        if (login_user_uuid) {
            fetchUserConversations(login_user_uuid);
        } else {
            setAllParticipants(initialConversationState)
        }
    }, [login_user_uuid]);

    const fetchUserConversations = (user_uuid: string) => {
        axios_base_api.get(CHAT_ENDPOINT.get_conversation, { params: { user_uuid } }).then((res) => {
            const result = res.data.data as IUserChatConversation[]
            setAllParticipants({
                ...allParticipants,
                participiants: convertDaumToChatParticipants(user_uuid, result)
            })
        }).catch((error) => {
            console.error("createNewMessageConversation Error: ", error)
        })
    }

    const onAddNewParticipant = (new_ps: IChatParticipant) => setAllParticipants({
        ...allParticipants,
        participiants: [new_ps, ...allParticipants.participiants],
        selected: new_ps
    })

    const onParticipantChange = (ps: IChatParticipant | null) => setAllParticipants({
        ...allParticipants,
        selected: ps
    })

    const memoizedReturn = useMemo(() => {
        return {
            conversations: allParticipants.participiants,
            selectedParticipiant: allParticipants.selected,
            onRefresh: () => login_user_uuid && fetchUserConversations(login_user_uuid),
            onAddNewParticipant,
            onParticipantChange
        };
    }, [allParticipants]);

    return memoizedReturn
}


/**
 * Sorts an array of objects by a date property in ascending order (oldest to newest)
 * @param array Array to sort
 * @param dateKey Key of the date property
 * @returns New sorted array (original array remains unchanged)
 */
function sortByDateAsc(array: IUserChatMessage[]): IUserChatMessage[] {
    // Create shallow copy to avoid mutating original array
    return array.sort((a, b) => {
        const dateA = new Date(a.create_ts || "");
        const dateB = new Date(b.create_ts || "");
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
    });
}

export function useGetMessagess(conversation_uuid: string | null) {
    const [allMessages, setAllMessages] = useState<IUserChatMessage[]>([])

    React.useEffect(() => {
        if (conversation_uuid) {
            fetchUserConversations(conversation_uuid);
        } else {
            setAllMessages([])
        }
    }, [conversation_uuid]);

    const fetchUserConversations = (uuid: string) => {
        axios_base_api.get(CHAT_ENDPOINT.get_messages, { params: { conversation_uuid: uuid } }).then((res) => {
            setAllMessages(res.data.data)
        }).catch((error) => {
            console.error("createNewMessageConversation Error: ", error)
        })
    }

    const onAddNewMessage = (message: IUserChatMessage) => setAllMessages([
        ...allMessages,
        message
    ])

    const memoizedReturn = useMemo(() => {
        return {
            messages: sortByDateAsc(allMessages),
            onAddNewMessage,
        };
    }, [allMessages]);

    return memoizedReturn
}
// ----------------------------------------------------------------------

// export async function sendConversationMessage(messageData: IUserChatMessage) {
//     const conversationsUrl = [CHAT_ENDPOINT.upsert_messages, { params: { endpoint: 'conversations' } }];

//     const conversationUrl = [CHAT_ENDPOINT.upsert_messages, { params: { conversationId, endpoint: 'conversation' } }];

//     /**
//      * Work on server
//      */
//     if (enableServer) {
//         const data = { conversationId, messageData };
//         await axios_base_api.post(CHART_ENDPOINT.upsert_messages, data);
//     }

//     /**
//      * Work in local
//      */
//     mutate(conversationUrl, (currentData: any) => {
//         const currentConversation: IChatConversation = currentData.conversation;

//         const conversation = {
//             ...currentConversation,
//             messages: [...currentConversation.messages, messageData],
//         };

//         return { ...currentData, conversation };
//     },
//         false
//     );

//     mutate(conversationsUrl, (currentData: any) => {
//         const currentConversations: IChatConversation[] = currentData.conversations;

//         const conversations: IChatConversation[] = currentConversations.map(
//             (conversation: IChatConversation) =>
//                 conversation.id === conversationId
//                     ? { ...conversation, messages: [...conversation.messages, messageData] }
//                     : conversation
//         );

//         return { ...currentData, conversations };
//     },
//         false
//     );
// }

// ----------------------------------------------------------------------

function toIsoIfNotAlready(input: string): string {
    return moment(input, "YYYY-MM-DD HH:mm:ss").toISOString();
}
export const createNewMessageConversation = (conversationData: IUserChatMessage) => new Promise<IUserChatMessage>((resolve, reject) => {
    axios_base_api.post(CHAT_ENDPOINT.upsert_messages, conversationData).then((res) => {
        const data: IUserChatMessage = res.data.data
        resolve({
            ...data,
            create_ts: moment().toISOString()
        })
    }).catch((error) => {
        console.error("createNewMessageConversation Error: ", error)
    })
})

type IMessgaesData = {
    data: IChatConversation;
};

export const fetchSingleUserMessgaes = (sender_uuid: string, receiver_uuid: string) => new Promise<IChatConversation>((resolve, reject) => {
    axios_base_api.get(CHAT_ENDPOINT.get_messages, { params: { sender_uuid, receiver_uuid } }).then((res) => {
        resolve(res.data.data)
    })
})