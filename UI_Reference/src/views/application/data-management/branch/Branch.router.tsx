import { lazy } from 'react';
import { main_app_routes, paths } from 'src/routes/paths';



const BranchTableView = lazy(() => import('./BranchTableView'));
const ManageSingleBranch = lazy(() => import('./ManageSingleBranch'));

export const branchRoutes = [
    { path: main_app_routes.app.management.branch, element: <BranchTableView /> },
    { path: `${main_app_routes.app.management.branch}/manage`, element: <ManageSingleBranch /> },
    { path: `${main_app_routes.app.management.branch}/manage/:uuid`, element: <ManageSingleBranch /> },
]