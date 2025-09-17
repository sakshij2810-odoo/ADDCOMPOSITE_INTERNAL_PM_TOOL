import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const CreatePublicLeadForm = lazy(() => import('./CreatePublicLeadForm'));

export const privateLeadsRoute = [
    { path: `${main_app_routes.public.leads}/create`, element: <CreatePublicLeadForm /> },
]