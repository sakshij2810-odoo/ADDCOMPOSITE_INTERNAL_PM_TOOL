import { lazy } from 'react';
import ManageSinglePrivateLead from './ManageSinglePrivateLead';
import { main_app_routes } from 'src/routes/paths';



const PrivateLeadsTable = lazy(() => import('./PrivateLeadsTable'));
const SingleLeadWithTabs = lazy(() => import('./SingleLeadWithTabs'));

export const privateLeadsRoute = [
    { path: main_app_routes.app.leads.root, element: <PrivateLeadsTable /> },
    { path: `${main_app_routes.app.leads.root}/manage`, element: <ManageSinglePrivateLead fullView /> },
    { path: `${main_app_routes.app.leads.root}/manage/:uuid`, element: <SingleLeadWithTabs /> },
    { path: `${main_app_routes.app.leads.root}/manage/:uuid/:service_type`, element: <SingleLeadWithTabs /> },
    { path: `${main_app_routes.app.leads.root}/manage/:referral_code`, element: <ManageSinglePrivateLead fullView /> },
]