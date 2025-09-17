import React from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { main_app_routes } from 'src/routes/paths';
import AccountTabsView from './AccountTabsView';
import { Tab, Tabs } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { AccountGeneralnformation } from './tabs-view/AccountGeneralnformation';
import { AccountChangePassword } from 'src/sections/account/account-change-password';


// const TABS = [
//     { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
//     //   { value: 'billing', label: 'Billing', icon: <Iconify icon="solar:bill-list-bold" width={24} /> },
//     //   {
//     //     value: 'notifications',
//     //     label: 'Notifications',
//     //     icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
//     //   },
//     //   { value: 'social', label: 'Social links', icon: <Iconify icon="solar:share-bold" width={24} /> },
//     { value: 'security', label: 'Security', icon: <Iconify icon="ic:round-vpn-key" width={24} /> },
// ];



const SingleUserProfileWithTabs = () => {

    // const tabs = useTabs('general');

    return (
        <DashboardContent>

            {/* <CustomBreadcrumbs
                heading="Account"
                links={[
                    { name: 'Users', href: main_app_routes.app.users },
                    { name: 'Account' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
                {TABS.map((tab) => (
                    <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
                ))}
            </Tabs>

            {tabs.value === 'general' && <AccountGeneralnformation />}

            {tabs.value === 'security' && <AccountChangePassword />} */}


            <CustomBreadcrumbs
                heading="Account"
                links={[
                    { name: 'Users', href: main_app_routes.app.users },
                    { name: 'Account' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <AccountTabsView />
        </DashboardContent>
    );
};

export default SingleUserProfileWithTabs;
