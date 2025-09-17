import React, { useState } from 'react'



import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard'
import { IStoreState, useAppDispatch, useAppSelector } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType, IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { clearCustomerServicesListStateSync, defaultCustomerService, fetchCustomerMultipleServicesWithArgsAsync, ICustomerService } from 'src/redux/child-reducers';

import { usePopover } from 'src/components/custom-popover';
import { useParams, useRouter } from 'src/routes/hooks';
import { Box, Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { CustomerServiceForm } from './CustomerServiceForm';

export const CustomerServicesTableView = () => {
  const { uuid: customer_uuid } = useParams() as { uuid?: string };
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
    loading: dataLoading
  } = useAppSelector((storeState: IStoreState) => storeState.leads.customers.customer_services_list);

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

  const [customerServiceDialog, setCustomerServiceDialog] = useState<ICustomerService | null>(null)
  const fetchList = () => {
    if (!customer_uuid) return
    dispatch(
      fetchCustomerMultipleServicesWithArgsAsync({
        queryParams: {
          page: pagination.pageNumber,
          rowsPerPage: pagination.rowsPerPage,
          status: tabs.selectedTab,
          date: dateState.dates,
          searchValue: searchState,
        },
        customer_uuid
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
    customer_uuid
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
        onRowCellRender: (value, row: ICustomerService) =>
          <StandardTableActions onEditClick={() => setCustomerServiceDialog(row)} />
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
        key: "country",
        headerName: "Country",
        fieldName: "country",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,

      },
      {
        key: "state_or_province",
        headerName: "State/Province",
        fieldName: "state_or_province",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,

      },
      {
        key: "services_type",
        headerName: "Servcie Type",
        fieldName: "services_type",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,

      },
      {
        key: "services_sub_type",
        headerName: "Service Sub Type",
        fieldName: "services_sub_type",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },
      {
        key: "questionnaire_name",
        headerName: "Checklist Name",
        fieldName: "questionnaire_name",
        renderType: DataTableV2RowRenderType.TEXT_DARK,
        enableSorting: true,
      },

      {
        key: "created_by_name",
        headerName: "Created by",
        fieldName: "created_by_name",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.TEXT_DARK,
      },
      {
        key: "create_ts",
        headerName: "Date Created",
        fieldName: "create_ts",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.DATE_TIME,
      },
      {
        key: "modified_by_name",
        headerName: "Modified by",
        fieldName: "modified_by_name",
        enableSorting: true,
        renderType: DataTableV2RowRenderType.TEXT_DARK,
      },
      {
        key: "insert_ts",
        headerName: "Date Modified",
        fieldName: "insert_ts",
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


  React.useEffect(() => {
    return () => {
      dispatch(clearCustomerServicesListStateSync());
    }
  }, [dispatch]);


  const hanndeCreateNewLeadClick = () => {
    setCustomerServiceDialog({
      ...defaultCustomerService,
      customer_uuid: customer_uuid as string
    })
  }

  return (
    <DashboardContent disablePadding metaTitle='Customer Service'>

      {customerServiceDialog ? <CustomerServiceForm
        data={customerServiceDialog}
        onCancel={() => setCustomerServiceDialog(null)}
        onSaveSuccess={() => setCustomerServiceDialog(null)}
      />
        :
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 2 }}>
            <Button
              onClick={hanndeCreateNewLeadClick}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Service
            </Button>
          </Box>
          <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
        </>
      }
    </DashboardContent>
  )
}
