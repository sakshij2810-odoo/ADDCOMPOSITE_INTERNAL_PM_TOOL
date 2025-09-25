import { Box, Card, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ProfileCover } from 'src/sections/user/profile-cover';
import { CommentModule } from 'src/sections/Comment/CommentModule';
import { useParams } from 'react-router';
import {
  CustomerBasicDetailsForm,
  CustomerServicesTableView,
  DocumentsChecklist,
  InvoicesAndPayments,
  CustomerRetainerAgreementsTable,
} from './tabs-view';
import { useAuthContext } from 'src/auth/hooks';
// TODO: Replace with real API calls to fetch user data
// import { _userAbout } from 'src/_mock';
import { CustomerContext, CustomerInfoProvider } from './provider';
import { CustomerProfileCover } from './CustomerProfileCover';
import { InvoiceAndPaymentsTable } from './tabs-view/invoice-and-payments/InvoiceAndPaymentsTable';
import { ITab, useTabsSecurity } from 'src/security/hooks/useTabsSecurity';
import { MODULE_KEYS } from 'src/constants/enums';
import { clearSingleCustomerStateSync, useAppDispatch } from 'src/redux';

const TABS: ITab[] = [
  {
    value: 'RETAINER_DUCUMENTS',
    label: 'Retainer Documents',
    module: MODULE_KEYS.CUSTOMER_RETAINER,
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'INVOICES_AND_PAYMENTS',
    label: 'Invoices & Payments',
    module: MODULE_KEYS.CUSTOMER_INVOICE_AND_PAYMENT,
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'BASIC_DETAILS',
    label: 'Personal Information Form',
    module: MODULE_KEYS.CUSTOMER_PERSONAL_INFORMATION,
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'SERVICES',
    label: 'Services',
    module: MODULE_KEYS.CUSTOMER_SERVICES,
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },

  // { value: 'DOCUMENTS_CHECKLIST', label: 'Documents Checklist', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
];

const SingleLeadWithTabs = () => {
  const { uuid } = useParams() as { uuid?: string };
  const accessibleTabs = useTabsSecurity(TABS);
  const tabs = useTabs(accessibleTabs[0]?.value);
  const dispatch = useAppDispatch();
  // React.useEffect(() => {
  //     if (uuid) {
  //         setLeadTabs([
  //             ...leadTabs,
  //             { value: 'activity', label: 'Activity', icon: <Iconify icon="solar:tuning-linear" width={24} /> },
  //             { value: 'comment', label: 'Comments', icon: <Iconify icon="solar:chat-round-line-line-duotone" width={24} /> },
  //         ])
  //     }
  // }, [uuid]);

  // React.useEffect(() => {
  //     return () => {
  //         dispatch(clearSingleCustomerStateSync())
  //     }
  // }, [dispatch]);
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Manage Customers"
        links={[{ name: 'Customers', href: paths.dashboard.customers }, { name: 'Manage' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <CustomerInfoProvider>
        <Card sx={{ mb: 3, height: 290 }}>
          <CustomerProfileCover />

          <Box
            display="flex"
            justifyContent={{ xs: 'center', md: 'flex-start' }}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              px: { md: 3 },
              position: 'absolute',
              bgcolor: 'background.paper',
            }}
          >
            <Tabs value={tabs.value} onChange={tabs.onChange}>
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </Box>
        </Card>
        {tabs.value === 'SERVICES' && <CustomerServicesTableView />}

        {tabs.value === 'RETAINER_DUCUMENTS' && <CustomerRetainerAgreementsTable />}

        {tabs.value === 'INVOICES_AND_PAYMENTS' && <InvoiceAndPaymentsTable />}
        {tabs.value === 'BASIC_DETAILS' && <CustomerBasicDetailsForm />}
        {tabs.value === 'DOCUMENTS_CHECKLIST' && <DocumentsChecklist />}
      </CustomerInfoProvider>
    </DashboardContent>
  );
};
export default SingleLeadWithTabs;
