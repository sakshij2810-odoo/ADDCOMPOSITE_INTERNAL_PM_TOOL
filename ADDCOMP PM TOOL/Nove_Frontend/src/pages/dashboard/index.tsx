import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppConfiguration } from 'src/providers';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  const { favIcon, companyName } = useAppConfiguration();
  return (
    <>
      <Helmet>
        <link rel="icon" href={favIcon} />
        <title>{companyName}</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
