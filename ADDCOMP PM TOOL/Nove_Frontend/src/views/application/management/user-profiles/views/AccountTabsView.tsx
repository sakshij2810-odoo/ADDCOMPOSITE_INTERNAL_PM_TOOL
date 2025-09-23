import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { AccountGeneralnformation } from './tabs-view/AccountGeneralnformation';
import { AccountChangePassword } from './tabs-view/AccountChangePassword';

const TABS = [
  { value: 'general', label: 'General' },
  { value: 'security', label: 'Security' },
];

interface AccountTabsViewProps {
  uuid?: string;
}

export default function AccountTabsView({ uuid }: AccountTabsViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'general';

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'general' });
    }
  }, [searchParams, setSearchParams]);

  // Log the uuid to verify it's being passed
  useEffect(() => {
    if (uuid) {
      console.log('UUID received in AccountTabsView:', uuid);
      // Here you would typically fetch user data based on this UUID
    }
  }, [uuid]);

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
      {currentTab === 'general' && <AccountGeneralnformation uuid={uuid} />}
      {currentTab === 'security' && <AccountChangePassword />}
    </>
  );
} 