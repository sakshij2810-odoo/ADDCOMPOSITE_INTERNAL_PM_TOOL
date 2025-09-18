/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { DataTableV2 } from "src/mui-components/TableV2/DataTableV2";
import { clearRecordCountStateSync, clearSecurityRoleGroupListAsync, createTabsWithRecordcounts, fetchRecordCountAsync, ILoadState, IStoreState, useAppDispatch, useAppSelector, useRecordCountStore } from "src/redux";
import { defaultSecurityRoleGroup } from "src/redux/child-reducers/app-security/role-group/role-group.state";
import { main_app_routes, paths } from "src/routes/paths";
import { ManageRoleGroupDialog } from "./ManageRoleGroupDialog";
import { ISecurityRoleGroup } from "src/redux/child-reducers/app-security/role-group/role-group.types";
import { fetchSecurityRoleGroupListAsync } from "src/redux/child-reducers/app-security/role-group/role-group.actions";
import { DataTableV2RowRenderType, IDataTableV2Props } from "src/mui-components/TableV2/interfaces/IDataTableV2Props";
import { useRouter } from "src/routes/hooks";
import { RenderType } from "src/mui-components/TableV1/interfaces/IDataTableProps";
import { StatusRenderer } from "src/mui-components/ActiveInActiveStatus";
import { StandardTableActions } from "src/mui-components/StandardTableActions/StandardTableActions";
import { useTableV2State } from "src/mui-components/TableV2/hooks/useTableV2State";


const SecurityRoleGroupTableView: React.FC = () => {
  const router = useRouter();

  const {
    data: recordCountArray,
    loading: recordCountLoading
  } = useRecordCountStore();
  const { list: multipleDataArray, loading: dataLoading, totalRecords: totalCount } = useAppSelector(
    (storeState: IStoreState) => storeState.management.security.roleGroups,
  );
  const dispatch = useAppDispatch();

  // Safe data handling - prevent undefined errors
  const safeRecordCountArray = recordCountArray ?? [];
  const safeMultipleDataArray = multipleDataArray ?? [];
  const safeTotalCount = totalCount ?? 0;

  // Debug logging (non-invasive)
  console.log('SecurityRoleGroupTableView props:', JSON.stringify({
    recordCountArray: safeRecordCountArray,
    multipleDataArray: safeMultipleDataArray,
    totalCount: safeTotalCount,
    dataLoading,
    recordCountLoading
  }, null, 2));

  // WebSocket connection check (non-invasive logging)
  React.useEffect(() => {
    const checkWebSocketConnection = () => {
      try {
        // Check if WebSocket is available and log connection status
        if (typeof WebSocket !== 'undefined') {
          console.log('WebSocket is available in this environment');
        } else {
          console.warn('WebSocket is not available in this environment');
        }
      } catch (error) {
        console.warn('WebSocket connection check failed:', error);
      }
    };
    
    checkWebSocketConnection();
  }, []);

  const [selectedRoleGroup, setSelectedRoleGroup] =
    React.useState<ISecurityRoleGroup | null>(null);

  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
  });

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
    dispatch(fetchRecordCountAsync("latest_role_group"))
    dispatch(
      fetchSecurityRoleGroupListAsync({
        page: pagination.pageNumber,
        rowsPerPage: pagination.rowsPerPage,
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
        customPlugins: [],
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
        onRowCellRender: (value, row: ISecurityRoleGroup) => {
          // Safe handling for row data
          if (!row) {
            console.warn('SecurityRoleGroupTableView: Row data is undefined');
            return <div>No data</div>;
          }
          return <StandardTableActions
            onEditClick={() => setSelectedRoleGroup(row)}
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
            console.warn('SecurityRoleGroupTableView: Row or status is undefined');
            return <div>No status</div>;
          }
          return <StatusRenderer status={row.status} />;
        },
      },
      {
        key: "role_group",
        headerName: "Role Group",
        fieldName: "role_group",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,

      },
      {
        key: "create_ts",
        headerName: "Date",
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
      dispatch(clearSecurityRoleGroupListAsync());
      dispatch(clearRecordCountStateSync());
    };
  }, []);

  return (
    <DashboardContent metaTitle='Role Groups'>
      <CustomBreadcrumbs
        heading="Role Groups"
        links={[
          { name: 'Role Groups', href: main_app_routes.app.security.roleGroups },
          { name: 'List' },
        ]}
        action={
          <Button
            onClick={() => setSelectedRoleGroup(defaultSecurityRoleGroup)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create Role Group
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DataTableV2 {...tasksTableProps} selectionMode='multiple' />

      {selectedRoleGroup && (
        <ManageRoleGroupDialog
          open={true}
          roleGroup={selectedRoleGroup}
          onClose={() => setSelectedRoleGroup(null)}
        />
      )}
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
const SecurityRoleGroupTableViewWithErrorBoundary: React.FC = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      console.error('SecurityRoleGroupTableView Error:', error, errorInfo);
    }}
  >
    <SecurityRoleGroupTableView />
  </ErrorBoundary>
);

export default SecurityRoleGroupTableViewWithErrorBoundary