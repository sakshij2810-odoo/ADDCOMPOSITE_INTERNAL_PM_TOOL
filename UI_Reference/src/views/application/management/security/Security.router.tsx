import { lazy } from 'react';
import { main_app_routes } from 'src/routes/paths';



const CreateSecurityGroup = lazy(() => import('./CreateSecurityGroup'));
const SecurityGroupsTableView = lazy(() => import('./SecurityGroupsTableView'));



const SecurityRoleGroupTableView = lazy(() => import('./role-groups/SecurityRoleGroupTableView'));

const SecurityApprovalTableView = lazy(() => import('./approvals/SecurityApprovalTableView'));
const ManageSecurityApproval = lazy(() => import('./approvals/ManageSecurityApproval'));

export const appSecurityRoutes = [
    { path: main_app_routes.app.security.securityGroups, element: <SecurityGroupsTableView /> },
    { path: `${main_app_routes.app.security.securityGroups}/manage`, element: <CreateSecurityGroup /> },
    { path: `${main_app_routes.app.security.securityGroups}/manage/:roleId`, element: <CreateSecurityGroup /> },
    { path: `${main_app_routes.app.security.securityGroupsDuplicate}/:roleId`, element: <CreateSecurityGroup isDuplicate /> },

    { path: main_app_routes.app.security.roleGroups, element: <SecurityRoleGroupTableView /> },

    { path: main_app_routes.app.security.approvals, element: <SecurityApprovalTableView /> },
    { path: `${main_app_routes.app.security.approvals}/manage`, element: <ManageSecurityApproval /> },
    { path: `${main_app_routes.app.security.approvals}/manage/:approvalId`, element: <ManageSecurityApproval /> },
]