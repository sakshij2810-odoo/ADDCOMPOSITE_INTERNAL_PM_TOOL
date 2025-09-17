/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@mui/material";
import React from "react";
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
        key: "view",
        headerName: "Actions",
        fieldName: "",
        renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
        width: '90px',
        isFirstColumnSticky: true,
        onRowCellRender: (value, row: ISecurityRoleGroup) => <StandardTableActions
          onEditClick={() => setSelectedRoleGroup(row)}
        />
      },
      {
        key: "status",
        headerName: "Status",
        fieldName: "status",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
        onRowCellRender: (value, row) => {
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


export default SecurityRoleGroupTableView