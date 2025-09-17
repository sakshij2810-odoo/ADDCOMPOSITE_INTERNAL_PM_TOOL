import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const FileManagerTableView = lazy(() => import('./FileManagerTableView'));

export const filemanagerRoute = [
    { path: main_app_routes.app.fileManager, element: <FileManagerTableView /> },
    { path: `${main_app_routes.app.fileManager}/:path`, element: <FileManagerTableView /> },
    { path: `${main_app_routes.app.fileManager}/:path/:path`, element: <FileManagerTableView /> },
    { path: `${main_app_routes.app.fileManager}/:path/:path/:path`, element: <FileManagerTableView /> },
    { path: `${main_app_routes.app.fileManager}/:path/:path/:path/:path`, element: <FileManagerTableView /> },

]