



export type IChatAttachment = {
    name: string;
    size: number;
    type: string;
    path: string;
    preview: string;
    createdAt: string;
    modifiedAt: string;
};

export type IChatMessage = {
    id: string;
    body: string;
    senderId: string;
    contentType: string;
    createdAt: string;
    attachments: IChatAttachment[];
};

export type IGetParticipantOnlineStatus = {
    user_uuid: string,
    isOnline: boolean,
    timestamp: string,
}

export interface IUserChatConversation {
    conversation_uuid: string
    conversation_name: any
    last_message: IGetUserMessage
    participants: IChatParticipant[]
}

export type IChatParticipant = {
    user_uuid: string;
    user_name: string;
    user_role: string;
    user_email: string;
    avatar_url: string;
    phone_number: string;
    //   last_activity: string;
    is_online: boolean
    lastOnlineAt: string,
    status: 'online' | 'offline' | 'alway' | 'busy';
    conversation: {
        conversation_uuid: string,
        last_messsage: string,
        attachment: string | null
    } | null

};

export type IChatConversation = {
    id: string;
    type: string;
    unreadCount: number;
    messages: IChatMessage[];
    participants: IChatParticipant[];
};

export type IChatConversations = {
    byId: Record<string, IChatConversation>;
    allIds: string[];
};


export type IUserChatMessage = {
    messages_uuid: string | null,
    conversation_uuid: string | null,
    sender_uuid: string,
    sender_type: string,
    receiver_uuid: string,
    receiver_type: string,
    message: string,
    attachment: string | null,
    is_read: boolean,
    status: "ACTIVE" | "INACTIVE"

    insert_ts?: string
    create_ts?: string
};


export interface IGetUserMessage {
    messages_id: number
    messages_unique_id: number
    messages_uuid: string
    conversation_uuid: string
    sender_participants_uuid: string
    sender_uuid: string
    sender_type: string
    sender_name: string
    sender_avatar_url: any
    sender_phone_number: any
    sender_email: any
    sender_role: any
    receiver_participants_uuid: string
    receiver_uuid: string
    receiver_type: string
    receiver_name: string
    receiver_avatar_url: any
    receiver_phone_number: any
    receiver_email: any
    receiver_role: any
    message: string
    attachment: any
    is_read: number
    status: string
    created_by_uuid: string
    created_by_name: string
    modified_by_uuid: string
    modified_by_name: string
    create_ts: string
    insert_ts: string
}