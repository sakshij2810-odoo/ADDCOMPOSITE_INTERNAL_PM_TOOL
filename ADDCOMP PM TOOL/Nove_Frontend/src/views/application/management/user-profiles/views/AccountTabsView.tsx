import { Tab, Tabs } from '@mui/material';
import { useSearchParams, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { AccountGeneralnformation } from './tabs-view/AccountGeneralnformation';
import { AccountChangePassword } from './tabs-view/AccountChangePassword';

const TABS = [
  { value: 'general', label: 'General' },
  { value: 'security', label: 'Security' },
];

export default function AccountTabsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const currentTab = searchParams.get('tab') || 'general';

  console.log('🔍 [FRONTEND] AccountTabsView component loaded');
  console.log('🔍 [FRONTEND] URL params:', params);
  console.log('🔍 [FRONTEND] Search params:', searchParams.toString());
  console.log('🔍 [FRONTEND] Current tab:', currentTab);

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
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {currentTab === 'general' && <AccountGeneralnformation />}
      {currentTab === 'security' && <AccountChangePassword />}
    </>
  );
}
