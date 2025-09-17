import React from 'react'
/* eslint-disable react-hooks/exhaustive-deps */
import type { IService, IStoreState } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { main_app_routes, paths } from 'src/routes/paths';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard'
import { useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { clearRecordCountStateSync, clearServicesListStateSync, createTabsWithRecordcounts, fetchMultipleAnswersWithArgsAsync, fetchMultipleQuestionOptionsWithArgsAsync, fetchMultipleQuestionsWithArgsAsync, fetchMultipleServicesWithArgsAsync, fetchRecordCountAsync } from 'src/redux/child-reducers';

import { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';

const ServicesTableView = () => {
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
    } = useAppSelector((storeState: IStoreState) => storeState.management.services.services_list);

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
            selectedTab: "ACTIVE",
        },
    });

    const fetchList = () => {

        dispatch(
            fetchMultipleServicesWithArgsAsync({
                page: pagination.pageNumber,
                rowsPerPage: pagination.rowsPerPage,
                status: tabs.selectedTab,
                date: dateState.dates,
                searchValue: searchState,
            })
        );
    };

    React.useEffect(() => {
        dispatch(fetchRecordCountAsync("latest_services"))
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
                onRowCellRender: (value, row: IService) =>
                    <StandardTableActions onEditClick={() => router.push(`${main_app_routes.app.documents_and_services}/service/manage/${row.services_uuid}`)} />
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
                key: "country",
                headerName: "Country",
                fieldName: "country",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "services_type",
                headerName: "Service Type",
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
                headerName: "Questionnaire Name",
                fieldName: "questionnaire_name",
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
                { label: "In Active", value: "In ACTIVE", variant: "error" },
            ],
            recordCountArray
        );

        setTableTabs(tabsData);
    }, [recordCountArray]);


    React.useEffect(() => {
        return () => {
            dispatch(clearServicesListStateSync());
            dispatch(clearRecordCountStateSync());
        }
    }, [dispatch]);


    const hanndeCreateNewClick = () => {
        router.push(`${main_app_routes.app.documents_and_services}/service/manage`)
    }

    return (
        <DashboardContent metaTitle='Services' disablePadding>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: { xs: 3, md: 5 } }}>
                <Button
                    onClick={hanndeCreateNewClick}
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    Create New
                </Button>
            </Box>
            <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
        </DashboardContent>
    )
}



export default ServicesTableView