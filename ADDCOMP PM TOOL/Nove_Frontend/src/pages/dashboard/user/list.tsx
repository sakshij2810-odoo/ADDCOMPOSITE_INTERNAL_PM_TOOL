import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import React from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';

import { UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `User list | Dashboard - ${CONFIG.appName}` };

const sampleData = [
  { name: "Rempel, Hand and Herzog", email: "test1@gmail.com", city: "Test City", country: "Test Country", phone: "1234567890", zip_code: "123456", status: "Active" },
  { name: "Rempel, Hand and Herzog", email: "test2@gmail.com", city: "Test City", country: "Test Country", phone: "1234567890", zip_code: "123456", status: "Active" },
  { name: "Rempel, Hand and Herzog", email: "test3@gmail.com", city: "Test City", country: "Test Country", phone: "1234567890", zip_code: "123456", status: "Active" },
  { name: "Rempel, Hand and Herzog", email: "test4@gmail.com", city: "Test City", country: "Test Country", phone: "1234567890", zip_code: "123456", status: "Active" },
  { name: "Rempel, Hand and Herzog", email: "test5@gmail.com", city: "Test City", country: "Test Country", phone: "1234567890", zip_code: "123456", status: "Active" },
  { name: "Rempel, Hand and Herzog", email: "test6@gmail.com", city: "Test City", country: "Test Country", phone: "1234567890", zip_code: "123456", status: "Active" },
  { name: "Rempel, Hand and Herzog1", email: "test11@gmail.com", city: "Test City", country: "Test Country", phone: "1234567890", zip_code: "123456", status: "Active" },
  { name: "Rempel, Hand and Herzog2", email: "test12@gmail.com", city: "Test City", country: "Test Country", phone: "1234567890", zip_code: "123456", status: "Active" },
]




export default function Page() {
  const [tablePagination, setTablePagination] = React.useState({
    pageNumber: 1,
    rowsInPerPage: 25,
  });
  // const dispatch = useDispatchWrapper();
  // const [open, setOpen]= React.useState<IBusinessTask | null>(null);

  const {
    state: { dateState, searchState, tabs, columnsConfig },
    setDateState,
    setSelectedTab,
    setSearchState,
    setColumnVisibility,
  } = useTableV2State({
    filtersInitialState: {
      defaultDateRange: "last28Days",
      selectedTab: "-1",
    },
  });

  const fetchList = () => {
    // dispatch(
    //   fetchBusinessTasksListAsync(
    //     tablePagination.pageNumber,
    //     tablePagination.rowsInPerPage,
    //     tabs.selectedTab,
    //     dateState.dates,
    //     searchState,
    //     moduleName,
    //     subModuleName
    //   )
    // );
  };

  React.useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tablePagination,
    dateState.dates,
    tabs.selectedTab,
    searchState,
  ]);



  const tasksTableProps: IDataTableV2Props = {
    isPagination: true,
    totalRecords: 0,
    rowsPerPageOptions: tablePagination.rowsInPerPage,
    // isDataLoading: loading !== LoadState.Loaded,
    isDataLoading: false,

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
        onRowCellRender: (value, row: any) =>
          <StandardTableActions onEditClick={() => { }} />
        ,
      },
      {
        key: "status",
        headerName: "Status",
        fieldName: "status",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
        // onRowCellRender: (value, row: any) => {
        //   // 
        //   return <StatusRenderer status={row.status} />;
        // },
      },
      {
        key: "name",
        headerName: "User Name",
        fieldName: "name",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
        onRowCellRender: (value, row: any) => {
          // Combine first_name and last_name from the API response
          const firstName = row.first_name || '';
          const lastName = row.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim();
          return fullName || 'N/A';
        },
      },
      {
        key: "email",
        headerName: "Email",
        fieldName: "email",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,

      },
      {
        key: "city",
        headerName: "City",
        fieldName: "city",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        // exportCellWidth: 20,
        enableSorting: true,
      },
      {
        key: "country",
        headerName: "Country",
        fieldName: "country",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        // exportCellWidth: 20,
        enableSorting: true,
      },
      {
        key: "zip_code",
        headerName: "Zip Code",
        fieldName: "zip_code",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
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
    // tableTabProps: {
    //   selectedTab: tabs.selectedTab,
    //   tabs: tabs.tabs,
    //   onTabChange: (newSelectedTab) => {
    //     setSelectedTab(newSelectedTab);
    //   },
    // },

    rows: sampleData,

    onPageChange: (newPageNumber: number) => {
      setTablePagination({ ...tablePagination, pageNumber: newPageNumber });
    },
    onRowsPerPageChange: (pageNumber: number, rowsPerPage: number) => {
      setTablePagination({
        pageNumber,
        rowsInPerPage: rowsPerPage,
      });
    },

  };



  React.useEffect(() => {
    // dispatch(clearBusinessTasks());
  }, []);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserListView />
      <DashboardContent>
        <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
      </DashboardContent>
    </>
  );
}
