/* eslint-disable react-hooks/exhaustive-deps */
import type { IStoreState, IStudyProgram } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import React from 'react'

import { Button } from '@mui/material';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard'
import { useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { clearRecordCountStateSync, clearStudyProgramsFullStateSync, createTabsWithRecordcounts, fetchMultipleStudyProgramsWithArgsAsync, fetchRecordCountAsync } from 'src/redux/child-reducers';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { main_app_routes } from 'src/routes/paths';

const StudyProgramsTableView = () => {
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
  });

  const popover = usePopover();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const {
    data: recordCountArray,
    loading: recordCountLoading
  } = useRecordCountStore();
  const {
    data: multipleDataArray,
    count: totalCount,
    loading: dataLoading
  } = useAppSelector((storeState: IStoreState) => storeState.leads.studyPrograms.study_programs_list);

  const {
    state: { dateState, searchState, tabs, columnsConfig },
    setDateState,
    setSelectedTab,
    setTableTabs,
    setSearchState,
    setColumnVisibility,
  } = useTableV2State({
    filtersInitialState: {
      defaultDateRange: "last28Days",
      selectedTab: "-1",
    },
  });

  const fetchList = () => {
    dispatch(fetchRecordCountAsync("latest_study_program"))
    dispatch(
      fetchMultipleStudyProgramsWithArgsAsync({
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
  }, [
    pagination,
    dateState.dates,
    tabs.selectedTab,
    searchState,
  ]);



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
        customPlugins: [



        ],
      },
      rightItems: {
        customPlugins: [],
      },
    },

    masterColumns: [
      {
        key: "view",
        headerName: "Actions",
        fieldName: "",
        renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
        width: '90px',
        isFirstColumnSticky: true,
        onRowCellRender: (value, row: IStudyProgram) =>
          <StandardTableActions onEditClick={() => router.push(`${main_app_routes.app.programs.nocCodes}/manage/${row.study_program_uuid}`)} />
        ,
      },
      {
        key: "status",
        headerName: "Status",
        fieldName: "status",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
      },
      {
        key: "program_name",
        headerName: "Program Name",
        fieldName: "program_name",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,

      },
      {
        key: "program_type",
        headerName: "Program Type",
        fieldName: "program_type",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,

      },
      {
        key: "program_duration",
        headerName: "Program Duration",
        fieldName: "program_duration",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        // exportCellWidth: 20,
        enableSorting: true,
      },
      {
        key: "program_fee",
        headerName: "Program Fee",
        fieldName: "program_fee",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        // exportCellWidth: 20,
        enableSorting: true,
      },
      {
        key: "program_admission_opening_date",
        headerName: "Admission Start Date",
        fieldName: "program_admission_opening_date",
        renderType: DataTableV2RowRenderType.DATE_TIME,
        // exportCellWidth: 30,
        enableSorting: true,
      },
      {
        key: "program_admission_last_date",
        headerName: "Admission Last Date",
        fieldName: "program_admission_last_date",
        renderType: DataTableV2RowRenderType.DATE_TIME,
        // exportCellWidth: 30,
        enableSorting: true,
      },
      {
        key: "insert_ts",
        headerName: "Date Created",
        fieldName: "create_ts",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.DATE_TIME,
      },

    ],
    tableTabProps: {
      selectedTab: tabs.selectedTab,
      tabs: tabs.tabs,
      onTabChange: (newSelectedTab) => {
        console.log("newSelectedTab ===>", newSelectedTab)
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
        { label: "Active", value: "ACTIVE", variant: "success" },
        { label: "Dead", value: "DEAD", variant: "error" },
        { label: "Opportunity", value: "OPPORTUNITY", variant: "grey" },
      ],
      recordCountArray
    );

    setTableTabs(tabsData);
  }, [recordCountArray]);


  React.useEffect(() => {
    return () => {
      dispatch(clearStudyProgramsFullStateSync());
      dispatch(clearRecordCountStateSync());
    }
  }, [dispatch]);


  const hanndeCreateNewLeadClick = () => {
    router.push(`${main_app_routes.app.programs.studyProgram}/manage`)
  }

  return (
    <DashboardContent metaTitle='Study Programs' sx={{ mt: 3 }}>
      {/* <CustomBreadcrumbs
        heading="Study Programs"
        links={[
          { name: 'Study Programs', href: main_app_routes.app.programs.studyProgram },
          { name: 'List' },
        ]}
        action={
          <Button
            onClick={hanndeCreateNewLeadClick}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create Study Programs
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      /> */}
      <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
    </DashboardContent>
  )
}


export default StudyProgramsTableView