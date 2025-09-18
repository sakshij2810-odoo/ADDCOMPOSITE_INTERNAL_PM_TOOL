/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Button } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


import { DataTableV2 } from "src/mui-components/TableV2/DataTableV2";
import { Iconify } from "src/components/iconify";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { main_app_routes, paths } from "src/routes/paths";
import { clearRecordCountStateSync, clearSecurityApproval, createTabsWithRecordcounts, fetchRecordCountAsync, fetchSecurityApprovalListAsync, ILoadState, ISecurityApproval, IStoreState, useAppDispatch, useAppSelector, useRecordCountStore } from "src/redux";
import { usePopover } from "src/components/custom-popover";
import { useRouter } from "src/routes/hooks";
import { DataTableV2RowRenderType, IDataTableV2Props } from "src/mui-components/TableV2/interfaces/IDataTableV2Props";
import { useTableV2State } from "src/mui-components/TableV2/hooks/useTableV2State";
import { StatusRenderer } from "src/mui-components/ActiveInActiveStatus";
import { StandardTableActions } from "src/mui-components/StandardTableActions/StandardTableActions";

const SecurityApprovalTableView: React.FC = () => {

  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
  });

  const router = useRouter();
  const {
    data: recordCountArray,
    loading: recordCountLoading
  } = useRecordCountStore();
  const { list: multipleDataArray, loading: dataLoading, totalRecords: totalCount } = useAppSelector(
    (storeState: IStoreState) => storeState.management.security.approval,
  );
  const dispatch = useAppDispatch();

  // Safe data handling - prevent undefined crashes
  const safeRecordCountArray = recordCountArray ?? [];
  const safeMultipleDataArray = multipleDataArray ?? [];
  const safeTotalCount = totalCount ?? 0;

  // Debug logging (non-invasive)
  console.log('SecurityApprovalTableView props:', JSON.stringify({
    recordCountArray: safeRecordCountArray,
    multipleDataArray: safeMultipleDataArray,
    totalCount: safeTotalCount,
    dataLoading,
    recordCountLoading
  }, null, 2));

  const {
    state: { dateState, searchState, tabs, columnsConfig },
    setDateState,
    setSelectedTab,
    setTableTabs,
    setSearchState,
    setColumnVisibility,
  } = useTableV2State({
    filtersInitialState: {
      defaultDateRange: "allTimes",
      selectedTab: "-1",
    },
  });

  const fetchList = () => {
    dispatch(fetchRecordCountAsync("latest_approval_count"))
    dispatch(
      fetchSecurityApprovalListAsync({
        page: pagination.pageNumber,
        rowsPerPage: pagination.rowsPerPage,
      }),
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
    totalRecords: safeTotalCount,
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
        onRowCellRender: (value, row: ISecurityApproval) => {
          // Safe handling for row data
          if (!row || !row.approval_count_uuid) {
            console.warn('SecurityApprovalTableView: Row or approval_count_uuid is undefined');
            return <div>No data</div>;
          }
          return <StandardTableActions
            onEditClick={() => {
              router.push(`${main_app_routes.app.security.approvals}/manage/${row.approval_count_uuid}`
              );
            }}
          />;
        }
      },
      {
        key: "status",
        headerName: "Status",
        fieldName: "status",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
        onRowCellRender: (value, row) => {
          // Safe handling for row data
          if (!row || !row.status) {
            console.warn('SecurityApprovalTableView: Row or status is undefined');
            return <div>No status</div>;
          }
          return <StatusRenderer status={row.status} />;
        },
      },
      {
        key: "table_name",
        headerName: "Table Name",
        fieldName: "table_name",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
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
        setSelectedTab(newSelectedTab);
      },
    },

    rows: safeMultipleDataArray,

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
      safeRecordCountArray
    );

    setTableTabs(tabsData);
  }, [safeRecordCountArray]);

  React.useEffect(() => {
    return () => {
      dispatch(clearSecurityApproval());
      dispatch(clearRecordCountStateSync())
    };
  }, []);

  return (
    <DashboardContent metaTitle="Security Approvals">
      <CustomBreadcrumbs
        heading="Security Approvals"
        links={[
          { name: 'Security Approvals', href: main_app_routes.app.security.approvals },
          { name: 'List' },
        ]}
        action={
          <Button
            onClick={() => router.push(`${main_app_routes.app.security.approvals}/manage`)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create Approval
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
    </DashboardContent>
  );
};

// Error Boundary Fallback Component
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Something went wrong:</h2>
    <p style={{ color: 'red', marginBottom: '20px' }}>{error.message}</p>
    <button onClick={() => window.location.reload()}>
      Reload Page
    </button>
  </div>
);

// Wrapped component with ErrorBoundary
const SecurityApprovalTableViewWithErrorBoundary: React.FC = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      console.error('SecurityApprovalTableView Error:', error, errorInfo);
    }}
  >
    <SecurityApprovalTableView />
  </ErrorBoundary>
);

export default SecurityApprovalTableViewWithErrorBoundary