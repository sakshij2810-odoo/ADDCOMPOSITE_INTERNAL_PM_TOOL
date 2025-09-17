import { io, Socket } from "socket.io-client";
import { CONFIG } from "src/config-global";
import { IChatParticipant, IGetUserMessage, IUserChatMessage } from "src/views/application/chats/components/types/IChatTypes";

// ----------------------------- Base Urls ----------------------------------
const SOCKET_SERVER_URL = CONFIG.serverChatUrl // Backend URL

export const initializeSocket = (user_uuid: string): Socket => {
    const app_socket = io(SOCKET_SERVER_URL, {
        autoConnect: false, // Prevent automatic connection
        auth: {
            user_uuid // Send user_uuid uuid
        },
        // transports: ["polling", "websocket"], // fallback, // skip long-polling if your server allows
        // reconnectionAttempts: 3,   // limit noisy retries
        // timeout: 8000,             // ms before “connect_error”
    });
    app_socket.connect();
    return app_socket;
};


// const disconnectSocket = () => {
//     if (app_socket) {
//         app_socket.disconnect();
//         app_socket = null;
//     }
// };
export function sortChatMessgaesByDateAsc(array: IUserChatMessage[]): IUserChatMessage[] {
    // Create shallow copy to avoid mutating original array
    return array.sort((a, b) => {
        const dateA = new Date(a.create_ts || "");
        const dateB = new Date(b.create_ts || "");
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
    });
}


export const convertChatNotificationsToMessages = (notifications: IGetUserMessage[]): IUserChatMessage[] => {
    return notifications.map((notification) => ({
        messages_uuid: notification.messages_uuid,
        conversation_uuid: notification.conversation_uuid,
        sender_uuid: notification.sender_uuid,
        sender_type: notification.sender_type,
        receiver_uuid: notification.receiver_uuid,
        receiver_type: notification.receiver_type,
        message: notification.message,
        is_read: Boolean(notification.is_read),
        attachment: notification.attachment,
        status: notification.status as "ACTIVE",
    }))
}


export const convertChatNotificationsToParticipant = (message: IGetUserMessage): IChatParticipant => {
    return {
        user_uuid: message.sender_uuid,
        user_name: message.sender_name,
        user_role: message.sender_role,
        user_email: message.sender_email,
        avatar_url: message.sender_avatar_url ?? '',
        phone_number: message.sender_phone_number ?? '',
        is_online: true,
        lastOnlineAt: "",
        status: "online", // or dynamically assign based on your logic
        conversation: {
            conversation_uuid: message.conversation_uuid,
            last_messsage: message.message, // or assign from actual data if available
            attachment: null,
        },

    }
}