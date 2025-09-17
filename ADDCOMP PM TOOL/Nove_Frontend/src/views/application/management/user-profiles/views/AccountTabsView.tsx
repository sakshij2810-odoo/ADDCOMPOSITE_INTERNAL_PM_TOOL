import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { AccountGeneralnformation } from './tabs-view/AccountGeneralnformation';
import { AccountChangePassword } from './tabs-view/AccountChangePassword';

const TABS = [
  { value: 'general', label: 'General' },
  { value: 'security', label: 'Security' },
];

export default function AccountTabsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'general';

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'general' });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (_: any, value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <>
      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        {TABS.map(tab => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {currentTab === 'general' && <AccountGeneralnformation />}
      {currentTab === 'security' && <AccountChangePassword />}
    </>
  );
} 