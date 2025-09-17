import { lazy } from 'react';
import { paths } from 'src/routes/paths';



const CustomersTableView = lazy(() => import('./CustomersTableView'));
const SingleCustomerTabsView = lazy(() => import('./SingleCustomerTabsView'));

export const customersRoutes = [
    { path: paths.dashboard.customers, element: <CustomersTableView /> },
    { path: `${paths.dashboard.customers}/manage`, element: <SingleCustomerTabsView /> },
    { path: `${paths.dashboard.customers}/manage/:uuid`, element: <SingleCustomerTabsView /> },
]