import React from 'react';
import { Box, Card, Tab } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

import { DocumentsChecklist } from '../DocumentsChecklist';
import ServicesTableView from '../../../services/ServicesTableView';
import { CustomTabs } from 'src/components/custom-tabs';

const TABS = [
  { value: 'DOCUMENTS_CHECKLIST', label: 'Documents Checklist', icon: <Iconify icon="solar:document-bold" width={24} /> },
  { value: 'SERVICES', label: 'Services', icon: <Iconify icon="solar:settings-bold" width={24} /> },
];

export const GroupedChecklistandService = () => {
  const tabs = useTabs('DOCUMENTS_CHECKLIST');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Documents & Services"
        links={[
          { name: 'Management', href: paths.dashboard.root },
          { name: 'Documents & Services' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 1,
            px: 3,
            bgcolor: 'background.paper',
            display: 'flex',
          }}
        >
          <CustomTabs value={tabs.value} onChange={tabs.onChange} >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} sx={{
                fontWeight: 600,
                minWidth: 140,
                fontSize: 16,
                textTransform: 'none',
              }} />
            ))}
          </CustomTabs>
        </Box>
      </Card>

      {tabs.value === 'DOCUMENTS_CHECKLIST' && <DocumentsChecklist />}

      {tabs.value === 'SERVICES' && <ServicesTableView />}
    </DashboardContent>
  );
};

export default GroupedChecklistandService;
