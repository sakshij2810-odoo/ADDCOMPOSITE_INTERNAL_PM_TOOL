/* eslint-disable react-hooks/exhaustive-deps */
import type { IStoreState, IUserProfile } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import React, { useState } from 'react';

import { Button, Typography } from '@mui/material';

import { main_app_routes, paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import {
  clearUserProfileFullStateSync,
  fetchMultipleUsersWithArgsAsync,
} from 'src/redux/child-reducers';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { CreateNewUserDialog } from './dialogs/CreateNewUserDialog';
import { ButtonWithWriteAccess } from 'src/security/components/ButtonWithWriteAccess';
import { MODULE_KEYS } from 'src/constants/enums';

const UserProfilesTable = () => {
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
  });

  const popover = usePopover();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const {
    data: multipleDataArray,
    count: totalCount,
    loading: dataLoading,
  } = useAppSelector(
    (storeState: IStoreState) => storeState.management.userProfiles.user_profile_list
  );

  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const {
    state: { dateState, searchState, tabs, columnsConfig },
    setDateState,
    setSelectedTab,
    setTableTabs,
    setSearchState,
    setColumnVisibility,
  } = useTableV2State({
    filtersInitialState: {
      defaultDateRange: 'last28Days',
      selectedTab: '-1',
    },
  });

  const fetchList = () => {
    dispatch(
      fetchMultipleUsersWithArgsAsync({
        page: pagination.pageNumber,
        rowsPerPage: pagination.rowsPerPage,
        status: tabs.selectedTab,
        date: dateState.dates,
        searchValue: searchState,
      })
    );
  };

  React.useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, dateState.dates, tabs.selectedTab, searchState]);

  const tasksTableProps: IDataTableV2Props = {
    isPagination: true,
    totalRecords: totalCount,
    rowsPerPageOptions: pagination.rowsPerPage,
    isDataLoading: dataLoading === ILoadState.pending,
    tableCommandBarProps: {
      preDefinedPlugins: {
        dateFilter: {
          state: dateState,
          onChange: setDateState,
        },
        search: {
          state: searchState,
          onChange: setSearchState,
        },
        columnVisibility: {
          columnVisibility: columnsConfig.columnVisibility,
          onChange: setColumnVisibility,
        },
        refresh: {
          onClick: fetchList,
        },
      },
      leftItems: {
        customPlugins: [],
      },
      rightItems: {
        customPlugins: [],
      },
    },

    masterColumns: [
      {
        key: 'view',
        headerName: 'Actions',
        fieldName: '',
        renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
        width: '90px',
        isFirstColumnSticky: true,
        onRowCellRender: (value, row: IUserProfile) => {
          console.log('🔍 [FRONTEND] Edit button clicked for user:', row);
          console.log('🔍 [FRONTEND] User UUID:', row.user_uuid);
          console.log('🔍 [FRONTEND] main_app_routes.app.users:', main_app_routes.app.users);
          console.log(
            '🔍 [FRONTEND] main_app_routes.app.users.root:',
            main_app_routes.app.users.root
          );
          console.log(
            '🔍 [FRONTEND] Full edit URL:',
            `${main_app_routes.app.users.root}/manage/${row.user_uuid}`
          );

          return (
            <StandardTableActions
              onEditClick={() => {
                console.log(
                  '🔍 [FRONTEND] Navigating to:',
                  `${main_app_routes.app.users.root}/manage/${row.user_uuid}`
                );
                router.push(`${main_app_routes.app.users.root}/manage/${row.user_uuid}`);
              }}
            />
          );
        },
      },
      {
        key: 'status',
        headerName: 'Status',
        fieldName: 'status',
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
      },
      {
        key: 'applicant_name',
        headerName: 'User Name',
        fieldName: 'applicant_name',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
        onRowCellRender: (value, row: IUserProfile) => {
          //
          return (
            <Typography variant="body1">{`${row.first_name} ${row.last_name ? row.last_name : ''}`}</Typography>
          );
        },
      },
      {
        key: 'email',
        headerName: 'Email',
        fieldName: 'email',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'branch_name',
        headerName: 'Branch',
        fieldName: 'branch_name',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'role_value',
        headerName: 'User Role',
        fieldName: 'role_value',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        // exportCellWidth: 30,
        enableSorting: true,
      },
      {
        key: 'insert_ts',
        headerName: 'Date Created',
        fieldName: 'create_ts',
        enableSorting: true,
        renderType: DataTableV2RowRenderType.DATE_TIME,
      },
    ],
    tableTabProps: {
      selectedTab: tabs.selectedTab,
      tabs: tabs.tabs,
      onTabChange: (newSelectedTab) => {
        console.log('newSelectedTab ===>', newSelectedTab);
        setSelectedTab(newSelectedTab);
      },
    },

    rows: multipleDataArray,

    onPageChange: (newPageNumber) => {
      setPagination({ ...pagination, pageNumber: newPageNumber });
    },
    onRowsPerPageChange: (pageNumber, newRowsPerPage) => {
      setPagination({
        pageNumber,
        rowsPerPage: newRowsPerPage,
      });
    },
  };

  React.useEffect(() => {
    setTableTabs([
      { label: 'All', value: '-1', variant: 'default', count: 0 },
      { label: 'Active', value: 'ACTIVE', variant: 'success', count: 0 },
      { label: 'In Active', value: 'ACTIVE', variant: 'error', count: 0 },
      { label: 'blocked', value: 'BLOCKED', variant: 'grey', count: 0 },
      { label: 'Unauthorize', value: 'UNAUTHORIZE ', variant: 'warning', count: 0 },
    ]);
  }, []);

  React.useEffect(() => {
    return () => {
      dispatch(clearUserProfileFullStateSync());
    };
  }, [dispatch]);

  const hanndeCreateNewUserClick = () => {
    setOpenCreateUserDialog(true);
  };

  return (
    <DashboardContent metaTitle="Users">
      <CustomBreadcrumbs
        heading="Users"
        links={[{ name: 'Users', href: paths.dashboard.users }, { name: 'List' }]}
        action={
          <ButtonWithWriteAccess
            module={MODULE_KEYS.USERS}
            // component={RouterLink}
            onClick={hanndeCreateNewUserClick}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create New User
          </ButtonWithWriteAccess>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTableV2 {...tasksTableProps} selectionMode="multiple" />
      {openCreateUserDialog && (
        <CreateNewUserDialog
          open={openCreateUserDialog}
          onClose={() => setOpenCreateUserDialog(false)}
          onSaveSuccess={() => {}}
        />
      )}
    </DashboardContent>
  );
};

export default UserProfilesTable;
