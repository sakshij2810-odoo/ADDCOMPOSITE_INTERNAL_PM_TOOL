import React from 'react'
/* eslint-disable react-hooks/exhaustive-deps */
import type { IBranch, IQuestionnaire, IStoreState } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import { Button } from '@mui/material';

import { main_app_routes, paths } from 'src/routes/paths';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard'
import { useAppDispatch, useAppSelector } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { clearBranchListStateSync, clearQuestionnaireListStateSync, clearRecordCountStateSync, duplicateSingleQuestionnaireWithArgsAsync, fetchMultipleBranchesWithArgsAsync, fetchMultipleQuestionnairesWithArgsAsync } from 'src/redux/child-reducers';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { createTabsWithRecordcounts } from 'src/redux/child-reducers/general/general.helpers';
import { useRecordCountStore } from 'src/redux';
import { fetchRecordCountAsync } from 'src/redux/child-reducers/general/general.actions';

const BranchTableView = () => {
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
    } = useAppSelector((storeState: IStoreState) => storeState.dataManagement.branch.multiple_branches);

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
        dispatch(fetchRecordCountAsync("latest_branch"));
        dispatch(
            fetchMultipleBranchesWithArgsAsync({
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
                width: '120px',
                isFirstColumnSticky: true,
                onRowCellRender: (value, row: IBranch) =>
                    <StandardTableActions
                        onEditClick={() => router.push(`${main_app_routes.app.management.branch}/manage/${row.branch_uuid}`)}
                    />
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
                key: "branch_name",
                headerName: "Branch Name",
                fieldName: "branch_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "description",
                headerName: "Description",
                fieldName: "description",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
                turncateLength: 20

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
                { label: "In Active", value: "INACTIVE", variant: "error" },
            ],
            recordCountArray
        );
        setTableTabs(tabsData);
    }, [recordCountArray]);


    React.useEffect(() => {
        return () => {
            dispatch(clearBranchListStateSync());
            dispatch(clearRecordCountStateSync());
        }
    }, [dispatch]);


    const hanndeCreateNewLeadClick = () => {
        router.push(`${main_app_routes.app.management.branch}/manage`)
    }

    const handleDuplicateQuestionnaire = (uuid: string) => {
        dispatch(duplicateSingleQuestionnaireWithArgsAsync(uuid)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                fetchList();
            }
        })
    }

    return (
        <DashboardContent metaTitle='Branches'>
            <CustomBreadcrumbs
                heading="Branches"
                links={[
                    { name: 'Branches', href: main_app_routes.app.management.branch },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        onClick={hanndeCreateNewLeadClick}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Create Branch
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
        </DashboardContent>
    )
}



export default BranchTableView