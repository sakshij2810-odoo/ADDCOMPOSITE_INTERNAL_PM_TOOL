import { IUserProfile } from "src/redux";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { IChatParticipant } from "src/views/application/chats/components/types/IChatTypes";



export const getChatUsersAsync = () => new Promise<IChatParticipant[]>((resolve, reject) => {
    axios_base_api.get(server_base_endpoints.users.get_users).then((result) => {
        resolve(result.data.data)
    }).catch((error) => {
        console.log("getChatUsersAsync Error: ", error)
        reject(error)
    }).finally(() => resolve([]))
})