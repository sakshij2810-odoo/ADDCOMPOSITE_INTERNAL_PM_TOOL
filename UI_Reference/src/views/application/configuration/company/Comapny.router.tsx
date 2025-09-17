import { lazy } from 'react';



const ManageCompanyInformation = lazy(() => import('./ManageCompanyInformation'));

export const comapnyRoute = [
    { path: 'company', element: <ManageCompanyInformation /> },
]