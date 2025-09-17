import { lazy } from 'react';



const AppComponentsPage = lazy(() => import('./AppComponentsPage'));

export const componentsRoute = [
    { path: 'components', element: <AppComponentsPage /> },
]