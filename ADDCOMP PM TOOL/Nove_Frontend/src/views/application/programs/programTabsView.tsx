import React from 'react';
import { Box, Card, Tab, Tabs } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { main_app_routes } from 'src/routes/paths';

import CRSDrawTableView from './crs-draws/CRSDrawTableView';
import NOCCodesTableView from './noc-codes/NOCCodesTableView';
import StudyProgramsTableView from './study-program/StudyProgramsTableView';
import { useSearchParams } from 'react-router-dom';
import { ITab, useTabsSecurity } from 'src/security/hooks/useTabsSecurity';
import { MODULE_KEYS } from 'src/constants/enums';

const TABS: ITab[] = [
  {
    value: 'CRS_DRAWS',
    label: 'CRS Draws',
    icon: <Iconify icon="solar:document-bold" width={24} />,
    module: MODULE_KEYS.CRS_DRAWS
  },
  {
    value: 'NOC_CODES',
    label: 'NOC Codes',
    icon: <Iconify icon="solar:file-bold" width={24} />,
    module: MODULE_KEYS.NOC_CODES
  },
  {
    value: 'STUDY_PROGRAMS',
    label: 'Study Programs',
    icon: <Iconify icon="solar:bookmark-bold" width={24} />,
    module: MODULE_KEYS.STUDY_PROGRAM
  },
];

const ProgramTabsView = () => {
  const accessibleTabs = useTabsSecurity(TABS)
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab')
  const tabs = useTabs(accessibleTabs[0]?.value);

  React.useEffect(() => {
    const nativeEvent: any = new Event('click', { bubbles: true, cancelable: true });
    tabs.onChange(nativeEvent, currentTab || accessibleTabs[0]?.value)
  }, [currentTab]);

  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    setSearchParams({ 'tab': tabValue }); // Update the `tab` parameter
  };

  return (
    <DashboardContent metaTitle='Programs' >
      <CustomBreadcrumbs
        heading="Programs"
        links={[
          { name: 'Programs', href: main_app_routes.app.programs.root },
          {
            name:
              tabs.value === 'CRS_DRAWS'
                ? 'CRS Draws'
                : tabs.value === 'NOC_CODES'
                  ? 'NOC Codes'
                  : 'Study Programs',
          },
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
          <Tabs value={tabs.value} onChange={handleTabChange}  >
            {accessibleTabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {tabs.value === 'CRS_DRAWS' && <CRSDrawTableView />}

      {tabs.value === 'NOC_CODES' && <NOCCodesTableView />}

      {tabs.value === 'STUDY_PROGRAMS' && <StudyProgramsTableView />}
    </DashboardContent>
  );
};

export default ProgramTabsView;
