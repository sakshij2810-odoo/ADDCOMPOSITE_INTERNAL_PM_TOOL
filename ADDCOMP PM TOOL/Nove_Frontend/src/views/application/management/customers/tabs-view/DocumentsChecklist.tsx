/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import { paths } from 'src/routes/paths';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard';
import { IStoreState, useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import {
  DataTableV2RowRenderType,
  IDataTableV2Props,
} from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import {
  clearCrsDrawsFullStateSync,
  clearRecordCountStateSync,
  createTabsWithRecordcounts,
  fetchMultipleCrsDrawsWithArgsAsync,
  fetchRecordCountAsync,
  ICRSDraw,
} from 'src/redux/child-reducers';

import { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';

export const DocumentsChecklist = () => {
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
  });

  const popover = usePopover();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { data: recordCountArray, loading: recordCountLoading } = useRecordCountStore();
  const {
    data: multipleDataArray,
    count: totalCount,
    loading: dataLoading,
  } = useAppSelector((storeState: IStoreState) => storeState.leads.crsDraws.crs_draws_list);

  const {
    state: { dateState, searchState, tabs, columnsConfig },
    setDateState,
    setSelectedTab,
    setTableTabs,
    setSearchState,
    setColumnVisibility,
  } = useTableV2State({
    filtersInitialState: {
      defaultDateRange: 'allTimes',
      selectedTab: '-1',
    },
  });

  const fetchList = () => {
    dispatch(
      fetchRecordCountAsync("latest_questionnaire")
    );
    dispatch(
      fetchMultipleCrsDrawsWithArgsAsync({
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
        onRowCellRender: (value, row: ICRSDraw) => (
          <StandardTableActions
            onEditClick={() =>
              router.push(`${paths.dashboard.leads.nocCodes}/manage/${row.crs_draws_uuid}`)
            }
          />
        ),
      },
      {
        key: 'status',
        headerName: 'Status',
        fieldName: 'status',
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
        // onRowCellRender: (value, row: any) => {
        //   //
        //   return <StatusRenderer status={row.status} />;
        // },
      },
      {
        key: 'crs_draws_portal_id',
        headerName: 'CRS Draws portal ID',
        fieldName: 'crs_draws_portal_id',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'round_type',
        headerName: 'Round Type',
        fieldName: 'round_type',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: 'minimun_crs_score',
        headerName: 'Minimun CRS Score',
        fieldName: 'minimun_crs_score',
        renderType: DataTableV2RowRenderType.DATE,
        // exportCellWidth: 20,
        enableSorting: true,
      },
      {
        key: 'invitations_issued',
        headerName: 'Invitations Issued',
        fieldName: 'invitations_issued',
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        // exportCellWidth: 20,
        enableSorting: true,
      },
      {
        key: 'issue_date',
        headerName: 'Issue Date',
        fieldName: 'issue_date',
        renderType: DataTableV2RowRenderType.DATE_TIME,
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
      dispatch(clearCrsDrawsFullStateSync());
      dispatch(clearRecordCountStateSync());
    };
  }, [dispatch]);

  const hanndeCreateNewLeadClick = () => {
    router.push(`${paths.dashboard.leads.crsDraws}/manage`);
  };

  return (
    <DashboardContent disablePadding metaTitle="Documents Checklist" sx={{ mt: 3 }}>
      <DataTableV2 {...tasksTableProps} selectionMode="multiple" />
    </DashboardContent>
  );
};
