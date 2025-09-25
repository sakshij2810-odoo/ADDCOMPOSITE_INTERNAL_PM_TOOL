/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { defaultUserProfile, IUserProfile } from 'src/redux';
import { CustomFormLabel, CustomTextField } from 'src/mui-components/formsComponents';
import axios_base_api from 'src/utils/axios-base-api';

const INITIAL_STATE: IUserProfile = defaultUserProfile;

export interface IUsersAutoSearchByRole {
  label?: string;
  id?: string;
  roleId?: number;
  value: any;
  selectionBy?: 'user_uuid';
  onSelect?: (data: IUserProfile) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string | undefined;
}

export const UsersAutoSearchByRole: React.FC<IUsersAutoSearchByRole> = (props) => {
  const { roleId, value, label, selectionBy = 'user_uuid', disabled, error, helperText } = props;
  const [usersList, setUsersList] = React.useState<IUserProfile[]>([]);

  const fetchUsers = async () => {
    try {
      let url = '';
      if (roleId) {
        url = '?role_id=' + roleId;
      }
      const res = await axios_base_api.get(`/user/get-user?status=ACTIVE`);
      const data: IUserProfile[] = res.data.data;
      const finalData: IUserProfile[] = [];
      for (const user of data) {
        finalData.push(user);
      }
      setUsersList(finalData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getOptionLabel = (option: IUserProfile) => {
    return `${option.first_name} ${option?.last_name || ''}`;
  };

  const getValue = () => {
    return usersList.find((option) => option.user_uuid === value) || null;
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  React.useEffect(() => {
    getValue();
  }, [value]);

  return (
    <>
      {label && <CustomFormLabel>{label}</CustomFormLabel>}
      <Autocomplete
        options={usersList}
        sx={{
          '.MuiOutlinedInput-root': {
            paddingTop: '2px',
            paddingBottom: '2px',
            fontSize: '0.8rem',
            color: 'rgb(38, 38, 38)',
          },
        }}
        value={getValue()}
        defaultValue={value}
        getOptionLabel={getOptionLabel}
        onChange={(e, newValue) => {
          if (newValue) {
            if (props.onSelect) {
              props.onSelect(newValue);
              return;
            }
          }
          if (props.onSelect) {
            props.onSelect(INITIAL_STATE);
          }
        }}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            fullWidth
            value={value}
            disabled={disabled}
            error={error}
            helperText={error && helperText}
          />
        )}
      />
    </>
  );
};
