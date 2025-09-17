import React from "react";
import { Helmet } from "react-helmet-async";
import { useAppConfiguration } from "src/providers";


export const AppHeader: React.FC = () => {
  const { favIcon, companyName } = useAppConfiguration();

  return (
    <div>
      <Helmet>
        <link rel="icon" href={favIcon} />
        <title>{companyName}</title>
      </Helmet>
    </div>
  );
};
