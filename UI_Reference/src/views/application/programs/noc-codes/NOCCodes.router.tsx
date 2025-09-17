import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const NOCCodesTableView = lazy(() => import('./NOCCodesTableView'));
const ManageSingleNOCCode = lazy(() => import('./ManageSingleNOCCode'));

export const nocCodesRoutes = [
    { path: main_app_routes.app.programs.nocCodes, element: <NOCCodesTableView /> },
    { path: `${main_app_routes.app.programs.nocCodes}/manage`, element: <ManageSingleNOCCode /> },
    { path: `${main_app_routes.app.programs.nocCodes}/manage/:uuid`, element: <ManageSingleNOCCode /> },
]