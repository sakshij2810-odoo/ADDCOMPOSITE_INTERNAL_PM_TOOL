/* eslint-disable prefer-const */
/* eslint-disable import/order */
import React from 'react';
import { ICustomButtonProps } from './RoleBasedCustomButton.types';
import { Button, Tooltip } from '@mui/material';
import { usePremissions } from '../../PremissionsProvider/PremissionsProvider';

export const RoleBasedCustomButton: React.FC<ICustomButtonProps> = (props) => {
  let { editAccess, moduleId } = props;
  const { getPremissionsByModuleId } = usePremissions();
  // @ts-ignore
  const premissions = getPremissionsByModuleId(moduleId);
  editAccess = editAccess || premissions.edit_access;

  if (editAccess) {
    return <Button {...props} />;
  }
  return (
    <Tooltip title="You don't have write access!">
      <Button
        type="button"
        variant="contained"
        color="error"
        sx={{ opacity: 0.5, cursor: 'not-allowed' }}
      >
        {props.children}
      </Button>
    </Tooltip>
  );
};
