import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';


const ChatsMainView = lazy(() => import('./ChatsMainView'));

export const chatsRoutes = [
    { path: main_app_routes.app.chats, element: <ChatsMainView /> },

]