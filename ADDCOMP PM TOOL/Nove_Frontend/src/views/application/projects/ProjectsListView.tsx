/* eslint-disable react-hooks/exhaustive-deps */
import type { ICRSDraw, IStoreState, IProjectActivity } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import React from 'react';

import { Button } from '@mui/material';

import { main_app_routes } from 'src/routes/paths';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import {
  clearCrsDrawsFullStateSync,
  clearRecordCountStateSync,
  clearProjectActivitiesFullStateSync,
  createTabsWithRecordcounts,
  defaultProjectActivity,
  fetchMultipleCrsDrawsWithArgsAsync,
  fetchMultipleProjectActivitiesWithArgsAsync,
  fetchRecordCountAsync,
} from 'src/redux/child-reducers';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { ProjectFormRightPanel } from './sections/project-form-right-panel';

const ProjectsListView = () => {
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
  });
  const [openProjectActivityDialog, setOpenProjectActivityDialog] =
    React.useState<IProjectActivity | null>(null);

  const popover = usePopover();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { data: recordCountArray, loading: recordCountLoading } = useRecordCountStore();
  const {
    data: multipleDataArray,
    count: totalCount,
    loading: dataLoading,
  } = useAppSelector(
    (storeState: IStoreState) => storeState.projects.projectActivities.multiple_project_activities
  );

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
    dispatch(fetchRecordCountAsync('latest_crs_draws'));
    dispatch(
      fetchMultipleProjectActivitiesWithArgsAsync({
        queryParams: {
          page: pagination.pageNumber,
          rowsPerPage: pagination.rowsPerPage,
          status: tabs.selectedTab,
          date: dateState.dates,
          searchValue: searchState,
        },
      })
    );
  };

  React.useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, dateState.dates, tabs.selectedTab, searchState]);

  const projectsTableProps: IDataTableV2Props = {
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
        onRowCellRender: (value, row: IProjectActivity) => (
          <StandardTableActions onEditClick={() => setOpenProjectActivityDialog(row)} />
        ),
      },
      {
        key: 'status',
        headerName: 'Status',
        fieldName: 'status',
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
      },
      {
        key: 'name',
        headerName: 'Project Name',
        fieldName: 'name',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'project_id',
        headerName: 'Project ID',
        fieldName: 'project_id',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'projectType',
        headerName: 'Type',
        fieldName: 'projectType',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'priority',
        headerName: 'Priority',
        fieldName: 'priority',
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
        enableSorting: true,
      },
      {
        key: 'budget',
        headerName: 'Budget',
        fieldName: 'budget',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'startDate',
        headerName: 'Start Date',
        fieldName: 'startDate',
        renderType: DataTableV2RowRenderType.DATE,
        enableSorting: true,
      },
      {
        key: 'endDate',
        headerName: 'End Date',
        fieldName: 'endDate',
        renderType: DataTableV2RowRenderType.DATE,
        enableSorting: true,
      },
      {
        key: 'create_ts',
        headerName: 'Date Created',
        fieldName: 'create_ts',
        renderType: DataTableV2RowRenderType.DATE_TIME,
        enableSorting: true,
      },
      {
        key: 'insert_ts',
        headerName: 'Date Modified',
        fieldName: 'insert_ts',
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
    const tabsData = createTabsWithRecordcounts(
      [
        { label: 'Active', value: 'ACTIVE', variant: 'success' },
        { label: 'Dead', value: 'DEAD', variant: 'error' },
        { label: 'Opportunity', value: 'OPPORTUNITY', variant: 'grey' },
      ],
      recordCountArray
    );

    setTableTabs(tabsData);
  }, [recordCountArray]);

  React.useEffect(() => {
    return () => {
      dispatch(clearProjectActivitiesFullStateSync());
      dispatch(clearRecordCountStateSync());
    };
  }, [dispatch]);

  const hanndeCreateNewClick = () => {
    setOpenProjectActivityDialog(defaultProjectActivity);
  };

  const handleSaveSuccess = () => {
    setOpenProjectActivityDialog(null);
    fetchList();
  };

  return (
    <DashboardContent metaTitle="Projects" sx={{ mt: 3 }}>
      <CustomBreadcrumbs
        heading="Projects"
        links={[{ name: 'List' }]}
        action={
          <Button
            onClick={hanndeCreateNewClick}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create New
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DataTableV2 {...projectsTableProps} selectionMode="multiple" />
      {openProjectActivityDialog && (
        <ProjectFormRightPanel
          open={true}
          data={openProjectActivityDialog}
          onSaveSuccess={handleSaveSuccess}
          onClose={() => setOpenProjectActivityDialog(null)}
        />
      )}
    </DashboardContent>
  );
};

export default ProjectsListView;
