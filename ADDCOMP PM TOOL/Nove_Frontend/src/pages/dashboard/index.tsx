import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAppConfiguration } from 'src/providers';
import { ImageTest } from 'src/components/ImageTest';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  const { favIcon, companyName, logo } = useAppConfiguration();

  console.log('🔍 [DASHBOARD] Current values:', { favIcon, companyName, logo });

  return (
    <>
      <Helmet>
        <link
          rel="icon"
          href={favIcon}
          onError={(e) => {
            console.log('🔍 [FAVICON] Error loading favicon:', favIcon);
            console.log('🔍 [FAVICON] Error event:', e);
          }}
        />
        <title>{companyName}</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
