/* eslint-disable react-hooks/exhaustive-deps */
import type { ICRSDraw, IStoreState, ITaskActivity } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import React from 'react'

import { Button } from '@mui/material';

import { main_app_routes } from 'src/routes/paths';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard'
import { useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { clearCrsDrawsFullStateSync, clearRecordCountStateSync, clearTaskActivitiesFullStateSync, createTabsWithRecordcounts, defaultTaskActivity, fetchMultipleCrsDrawsWithArgsAsync, fetchMultipleTaskActivitiesWithArgsAsync, fetchRecordCountAsync } from 'src/redux/child-reducers';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { TaskActivityFormRightPanel } from './right-panel/TaskActivityFormRightPanel';

const TaskActivitiesTableView = () => {
    const [pagination, setPagination] = React.useState({
        pageNumber: 1,
        rowsPerPage: 10,
    });
    const [openTaskActivityDialog, setOpenTaskActivityDialog] = React.useState<ITaskActivity | null>(null);

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
    } = useAppSelector((storeState: IStoreState) => storeState.tasks.taskActivities.multiple_task_activities);

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
        dispatch(fetchRecordCountAsync("latest_crs_draws"))
        dispatch(
            fetchMultipleTaskActivitiesWithArgsAsync({
                queryParams: {
                    page: pagination.pageNumber,
                    rowsPerPage: pagination.rowsPerPage,
                    status: tabs.selectedTab,
                    date: dateState.dates,
                    searchValue: searchState,
                }
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
                onRowCellRender: (value, row: ITaskActivity) =>
                    <StandardTableActions onEditClick={() => setOpenTaskActivityDialog(row)} />
            },
            {
                key: "status",
                headerName: "Status",
                fieldName: "status",
                enableSorting: true,
                renderType: DataTableV2RowRenderType.CHIP_WARNING,
            },
            {
                key: "task_name",
                headerName: "Name",
                fieldName: "task_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "task_module_wise_code",
                headerName: "Code",
                fieldName: "task_module_wise_code",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "assigned_to_name",
                headerName: "Assigned To",
                fieldName: "assigned_to_name",
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
                key: "modified_by_name",
                headerName: "Modified By",
                fieldName: "modified_by_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
            },
            {
                key: "due_date",
                headerName: "Due Date",
                fieldName: "due_date",
                renderType: DataTableV2RowRenderType.DATE,
                enableSorting: true,
            },
            {
                key: "due_time",
                headerName: "Due Time",
                fieldName: "due_time",
                renderType: DataTableV2RowRenderType.TEXT,
                enableSorting: true,
            },
            {
                key: "create_ts",
                headerName: "Date Created",
                fieldName: "create_ts",
                renderType: DataTableV2RowRenderType.DATE_TIME,
                enableSorting: true,
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
            dispatch(clearTaskActivitiesFullStateSync());
            dispatch(clearRecordCountStateSync());
        }
    }, [dispatch]);


    const hanndeCreateNewClick = () => {
        setOpenTaskActivityDialog(defaultTaskActivity)
    }

    const handleSaveSuccess = () => {
        setOpenTaskActivityDialog(null);
        fetchList();
    }

    return (
        <DashboardContent metaTitle='Task/Activities' sx={{ mt: 3 }}>
            <CustomBreadcrumbs
                heading="Task Activities"
                links={[
                    { name: 'List' },
                ]}
                action={
                    <Button
                        onClick={hanndeCreateNewClick}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Create New
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
            {openTaskActivityDialog && (
                <TaskActivityFormRightPanel
                    open={true} data={openTaskActivityDialog} onSaveSuccess={handleSaveSuccess}
                    onClose={() => setOpenTaskActivityDialog(null)}
                />
            )}
        </DashboardContent>
    )
}

export default TaskActivitiesTableView