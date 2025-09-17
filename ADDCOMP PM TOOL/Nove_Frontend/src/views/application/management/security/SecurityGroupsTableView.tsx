/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
// import { CustomerBaiscDetailsLayout } from "../";
import { Button } from "@mui/material";

import { fetchMultipleSecurityRolesAsync, ILoadState, IRole, IStoreState, useAppDispatch, useAppSelector } from "src/redux";
import { useRouter } from "src/routes/hooks";
import { CustomLink } from "src/mui-components/CustomLink/CustomLink";
import { StandardTableActions } from "src/mui-components/StandardTableActions/StandardTableActions";
import { Iconify } from "src/components/iconify";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { main_app_routes, paths } from "src/routes/paths";
import { DashboardContent } from "src/layouts/dashboard";
import { StatusRenderer } from "src/mui-components/ActiveInActiveStatus";
import { DataTableV2RowRenderType, IDataTableV2Props } from "src/mui-components/TableV2/interfaces/IDataTableV2Props";
import { useTableV2State } from "src/mui-components/TableV2/hooks/useTableV2State";
import { DataTableV2 } from "src/mui-components/TableV2/DataTableV2";

const SecurityGroupsTableView: React.FC = () => {
  const router = useRouter()
  const { list: multipleDataArray, totalRecords: count, loading: dataLoading } = useAppSelector(
    (storeState: IStoreState) => storeState.management.security.roles,
  );
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
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
      defaultDateRange: "last28Days",
      selectedTab: "-1",
    },
  });

  const fetchList = () => {
    dispatch(
      fetchMultipleSecurityRolesAsync()
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
    totalRecords: count,
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
        onRowCellRender: (value, row: IRole) => {
          return (
            <StandardTableActions
              onEditClick={() => {
                router.push(`${main_app_routes.app.security.securityGroups}/manage/${row.role_uuid}`);
              }}
              onDuplicateClick={() => {
                router.push(`${main_app_routes.app.security.securityGroupsDuplicate}/${row.role_uuid}`);
              }}
            />
          );
        },
      },
      {
        key: "status",
        headerName: "Status",
        fieldName: "status",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.CHIP_WARNING,
        onRowCellRender: (value, row: any) => {
          return <StatusRenderer status={row.status} />;
        },
      },
      {
        key: "role_id",
        headerName: "ID",
        fieldName: "role_id",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
        onRowCellRender: (value, row: IRole) => {
          return (
            <CustomLink
              to={`${main_app_routes.app.security.securityGroups}/manage/${row.role_uuid}`}
              label={value.value}
            />
          );
        },

      },
      {
        key: "role_name",
        headerName: "Role Name",
        fieldName: "role_name",
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
    setTableTabs([
      { label: "All", value: "-1", variant: "default", count: 0 },
      { label: "Active", value: "ACTIVE", variant: "success", count: 0 },
      { label: "In Active", value: "INACTIVE", variant: "error", count: 0 },
    ])
  }, []);

  const handleClick = () => {
    router.push(`${main_app_routes.app.security.securityGroups}/manage`);
  };

  return (
    <DashboardContent metaTitle="Security list">
      <CustomBreadcrumbs
        heading="Security"
        links={[
          { name: 'Security', href: main_app_routes.app.security.root },
          { name: 'List' },
        ]}
        action={
          <Button
            onClick={handleClick}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Create Security Group
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
    </DashboardContent>
  );
};

export default SecurityGroupsTableView