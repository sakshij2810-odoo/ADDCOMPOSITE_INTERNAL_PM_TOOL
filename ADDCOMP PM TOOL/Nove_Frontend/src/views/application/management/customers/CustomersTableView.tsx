/* eslint-disable react-hooks/exhaustive-deps */
import type { ICRSDraw, ICustomer, IPrivateLead, IServiceType, IStoreState } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import React from 'react'

import { Button, MenuItem, MenuList } from '@mui/material';

import { main_app_routes, paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard'
import { useAppDispatch, useAppSelector } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { changeLeadTypeSync, clearCrsDrawsFullStateSync, clearCustomerServicesListStateSync, clearPrivateLeadsFullStateSync, clearStudyProgramsFullStateSync, fetchMultipleCrsDrawsWithArgsAsync, fetchMultipleCustomersWithArgsAsync, fetchMultiplePrivateLeadsWithArgsAsync, fetchMultipleStudyProgramsWithArgsAsync } from 'src/redux/child-reducers';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { ButtonWithWriteAccess } from 'src/security/components/ButtonWithWriteAccess';
import { MODULE_KEYS } from 'src/constants/enums';

const CustomersTableView = () => {
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
    } = useAppSelector((storeState: IStoreState) => storeState.leads.customers.customers_list);

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
            fetchMultipleCustomersWithArgsAsync({
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
                onRowCellRender: (value, row: ICustomer) =>
                    <StandardTableActions onEditClick={() => router.push(`${main_app_routes.app.customers}/manage/${row.customer_fact_uuid}`)} />
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
                key: "customer_first_name",
                headerName: "Customer Name",
                fieldName: "customer_first_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "customer_email",
                headerName: "Customer Email",
                fieldName: "customer_email",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "customer_address_country",
                headerName: "Country",
                fieldName: "customer_address_country",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
            },
            {
                key: "created_by_name",
                headerName: "Created By",
                fieldName: "created_by_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
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
                headerName: "Modified By",
                fieldName: "modified_by_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
            },
            {
                key: "insert_ts",
                headerName: "Date Modified",
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


    React.useEffect(() => {
        return () => {
            dispatch(clearCustomerServicesListStateSync());
        }
    }, [dispatch]);


    const hanndeCreateNewLeadClick = () => {
        router.push(`${paths.dashboard.customers}/manage`)
    }

    return (
        <DashboardContent metaTitle='Customers'>
            <CustomBreadcrumbs
                heading="Customers"
                links={[
                    { name: 'Customers', href: paths.dashboard.customers },
                    { name: 'List' },
                ]}
                action={
                    <ButtonWithWriteAccess
                        module={MODULE_KEYS.CUSTOMERS}
                        onClick={hanndeCreateNewLeadClick}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Create Customer
                    </ButtonWithWriteAccess>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
        </DashboardContent>
    )
}



export default CustomersTableView