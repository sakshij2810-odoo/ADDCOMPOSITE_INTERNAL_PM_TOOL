/* eslint-disable import/order */
import React from 'react';

import { IPageContainerProps } from './IPageContainer';
import { Helmet } from 'react-helmet-async';

export const PageContainer: React.FC<IPageContainerProps> = (props) => {
  const { title, description } = props;

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {props.children}
    </div>
  );
};
