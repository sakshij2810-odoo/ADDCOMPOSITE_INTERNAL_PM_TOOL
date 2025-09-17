import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const ProgramTabView = lazy(() => import('./programTabsView'));

export const programTabsRoutes = [
    { path: main_app_routes.app.programs.root, element: <ProgramTabView /> },

]