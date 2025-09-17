/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/jsx-curly-brace-presence */
import React from 'react';
import { Button, Typography } from '@mui/material';
import {
  clearRecordCountStateSync,
  createTabsWithRecordcounts,
  fetchRecordCountAsync,
  ILoadState,
  IStoreState,
  useAppDispatch,
  useAppSelector,
  useRecordCountStore,
} from 'src/redux';
import { useRouter } from 'src/routes/hooks';
import { CustomLink } from 'src/mui-components/CustomLink/CustomLink';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { main_app_routes, paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { StatusRenderer } from 'src/mui-components/ActiveInActiveStatus';
import {
  DataTableV2RowRenderType,
  IDataTableV2Props,
} from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import {
  fetchWorkflowListAsync,
  upsertWorkflowAsync,
} from 'src/redux/child-reducers/settings/automation/automation.actions';
import { IWorkflowGET } from 'src/redux/child-reducers/settings/automation/automation.types';
import { ConfirmDialog } from 'src/components/custom-dialog';

const Automation: React.FC = () => {
  const router = useRouter();
  const {
    list: workflowsList,
    totalRecords: count,
    loading: dataLoading,
  } = useAppSelector((storeState: IStoreState) => storeState.management.settings.automation);

  const { data: recordCountArray, loading: recordCountLoading } = useRecordCountStore();

  const [openConfirm, setOpenConfirm] = React.useState<IWorkflowGET | null>(null);
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
    extraFetchFactor: 1,
  });

  const dispatch = useAppDispatch();

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

    // cachingFilters: {
    //   uniqueKey: TABLE_CACHING_KEYS.AUTOMATION,
    // },
  });

  const fetchList = () => {
    dispatch(
      fetchWorkflowListAsync({
        page: pagination?.pageNumber,
        rowsPerPage: pagination?.rowsPerPage,
        status: tabs?.selectedTab,
        date: dateState?.dates,
        searchValue: searchState,
      })
    );

    dispatch(
      fetchRecordCountAsync("latest_workflow_basic")
    );
  };

  React.useEffect(() => {
    fetchList();
  }, [pagination, dateState.dates, tabs.selectedTab, searchState]);

  const handleConfirm = () => {
    if (openConfirm) {
      const toggledStatus = openConfirm.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      dispatch(
        upsertWorkflowAsync({
          data: { ...(openConfirm as any), status: toggledStatus },

          onCallback: (isSuccess) => {
            if (isSuccess) {
              setOpenConfirm(null);
              fetchList();
            }
          },
        })
      );
    }
  };

  const workflowsTableProps: IDataTableV2Props = {
    isPagination: true,
    extraFetchFactor: pagination?.extraFetchFactor,
    rowsPerPageOptions: pagination?.rowsPerPage,
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
        onRowCellRender: (value, row: IWorkflowGET) => {
          return (
            <StandardTableActions
              onEditClick={() => {
                router.push(
                  `${main_app_routes.app.settings.automation}/manage/${row.workflow_basic_code}`
                );
              }}
              onDeleteClick={row.status === 'ACTIVE' ? () => setOpenConfirm(row) : undefined}
              onRestoreClick={row.status === 'INACTIVE' ? () => setOpenConfirm(row) : undefined}
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
        onRowCellRender: (value, row: any) => {
          return <StatusRenderer status={row.status} />;
        },
      },
      {
        key: 'workflow_basic_code',
        headerName: 'Workflow Code',
        fieldName: 'workflow_basic_code',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
        onRowCellRender: (value, row: IWorkflowGET) => {
          return (
            <CustomLink
              to={`${main_app_routes.app.settings.automation}/manage/${row.workflow_basic_code}`}
              label={row.workflow_basic_code}
            />
          );
        },
      },
      {
        key: 'workflow_name',
        headerName: 'Workflow Name',
        fieldName: 'workflow_name',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'run_as',
        headerName: 'Run As',
        fieldName: 'run_as',
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
      },
      {
        key: 'insert_ts',
        headerName: 'Date Created',
        fieldName: 'insert_ts',
        enableSorting: true,
        renderType: DataTableV2RowRenderType.DATE_TIME,
      },
    ],
    tableTabProps: {
      selectedTab: tabs.selectedTab,
      tabs: tabs.tabs,
      onTabChange: (newSelectedTab) => {
        setSelectedTab(newSelectedTab);
      },
    },

    rows: workflowsList,
    totalRecords: count,
    onPageChange: (newPageNumber) => {
      setPagination({ ...pagination, pageNumber: newPageNumber });
    },
    onRowsPerPageChange: (pageNumber, newRowsPerPage) => {
      setPagination({
        pageNumber,
        rowsPerPage: newRowsPerPage,
        extraFetchFactor: 1,
      });
    },
  };

  React.useEffect(() => {
    const tabsData = createTabsWithRecordcounts(
      [
        { label: 'Active', value: 'ACTIVE', variant: 'success' },
        { label: 'InActive', value: 'INACTIVE', variant: 'error' },
      ],
      recordCountArray
    );

    setTableTabs(tabsData);
  }, [recordCountArray]);

  React.useEffect(() => {
    return () => {
      dispatch(clearRecordCountStateSync());
    };
  }, [dispatch]);

  const handleClick = () => {
    router.push(`${main_app_routes.app.settings.automation}/manage`);
  };

  return (
    <DashboardContent metaTitle="Automation list">
      <CustomBreadcrumbs
        heading="Automation"
        links={[
          { name: 'Settings', href: main_app_routes.app.settings.root },
          { name: 'Automation' },
        ]}
        action={
          <Button
            onClick={handleClick}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create Workflow
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DataTableV2 {...workflowsTableProps} selectionMode="multiple" />

      {openConfirm && (
        <ConfirmDialog
          open={true}
          content={
            <Typography variant="h4">
              {openConfirm.status === 'ACTIVE'
                ? 'Are you sure you want to delete this workflow?'
                : 'Are you sure you want to restore this workflow?'}
            </Typography>
          }
          onClose={() => setOpenConfirm(null)}
          action={<Button onClick={handleConfirm}>Confirm</Button>}
          title=""
        />
      )}
    </DashboardContent>
  );
};

export default Automation;
