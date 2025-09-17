/* eslint-disable react-hooks/exhaustive-deps */
import type { IPrivateLead, IServiceType, IStoreState } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import React from 'react'

import { Box, Button, MenuItem, MenuList, Typography } from '@mui/material';

import { main_app_routes, paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard'
import { useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import {
    changeLeadTypeSync, clearPrivateLeadsFullStateSync,
    clearRecordCountStateSync, createTabsWithRecordcounts, fetchMultiplePrivateLeadsWithArgsAsync, fetchMultipleServicesWithArgsAsync, fetchRecordCountAsync
} from 'src/redux/child-reducers';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { SignDocumentButton } from '../documents/components/SignDocumentButton';
import { useSetState } from 'src/hooks/use-set-state';
import { MuiRightPanel } from 'src/mui-components/RightPanel';
import { PreviewRetainerDocumentDialog } from '../dialogs/PreviewRetainerDocumentDialog';
import { ChooseLeadServiceDialog, ICreateLeadState } from './dialogs';
import { useBoolean } from 'src/hooks/use-boolean';
import { ButtonWithWriteAccess } from 'src/security/components/ButtonWithWriteAccess';
import { MODULE_KEYS } from 'src/constants/enums';
import { LeadUploadButton } from '../components/LeadUploadButton';

const PrivateLeadsTable = () => {
    const [pagination, setPagination] = React.useState({
        pageNumber: 1,
        rowsPerPage: 10,
    });

    const popover = usePopover();
    const router = useRouter();
    const viewRetainerDocument = useSetState<string | null>(null)
    const openCreateLeadDialog = useBoolean(false)

    const dispatch = useAppDispatch();
    const {
        data: recordCountArray,
        loading: recordCountLoading
    } = useRecordCountStore();
    const {
        data: multipleDataArray,
        count: totalCount,
        loading: dataLoading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.leads.private_leads_list);

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
        dispatch(fetchRecordCountAsync("latest_leads"))
        dispatch(
            fetchMultiplePrivateLeadsWithArgsAsync({
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

        return () => {
            dispatch(clearPrivateLeadsFullStateSync());
            dispatch(clearRecordCountStateSync());
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pagination,
        dateState.dates,
        tabs.selectedTab,
        searchState,
    ]);


    const tasksTableProps: IDataTableV2Props = {
        uniqueRowKeyName: "leads_uuid",
        extraFetchFactor: 1,
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
                onRowCellRender: (value, row: IPrivateLead) =>
                    <StandardTableActions
                        onEditClick={() => {
                            router.push(`${main_app_routes.app.leads.root}/manage/${row.leads_uuid}/${row.service_type}`)
                        }}
                    // more={{
                    //     menuItems: [
                    //         {
                    //             label: "View Retainer Document",
                    //             icon: "solar:cloud-file-bold",
                    //             onClick: () => viewRetainerDocument.setState(row.leads_uuid)
                    //         },
                    //     ],
                    // }}
                    />
                ,
            },
            {
                key: "status",
                headerName: "Status",
                fieldName: "status",
                enableSorting: true,
                width: '90px',
                renderType: DataTableV2RowRenderType.CHIP_WARNING,
            },
            // {
            //     key: "view",
            //     headerName: "Sign",
            //     fieldName: "",
            //     renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
            //     width: '120px',
            //     onRowCellRender: (value, row: IPrivateLead) =>
            //         <SignDocumentButton lead={row} />
            //     ,
            // },
            {
                key: "leads_code",
                headerName: "Lead Code",
                fieldName: "leads_code",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
            },
            {
                key: "applicant_name",
                headerName: "Applicant First Name",
                fieldName: "applicant_first_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
            },
            {
                key: "applicant_name",
                headerName: "Applicant Last Name",
                fieldName: "applicant_last_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
            },
            {
                key: "email",
                headerName: "Email",
                fieldName: "email",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "contact_number",
                headerName: "Phone",
                fieldName: "contact_number",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                // exportCellWidth: 20,
                enableSorting: true,
            },
            {
                key: "nationality",
                headerName: "Nationality",
                fieldName: "nationality",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                // exportCellWidth: 30,
                enableSorting: true,
            },
            {
                key: "service_type",
                headerName: "Service Type",
                fieldName: "service_type",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
            },
            {
                key: "service_sub_type",
                headerName: "Service Sub Type",
                fieldName: "service_sub_type",
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
        tableTabProps: {
            selectedTab: tabs.selectedTab,
            tabs: tabs.tabs,
            onTabChange: (newSelectedTab) => {
                console.log("newSelectedTab ===>", newSelectedTab)
                setSelectedTab(newSelectedTab);
            },
        },

        rows: multipleDataArray,
        selectionMode: "multiple",
        onPageChange: (newPageNumber) => {
            setPagination({ ...pagination, pageNumber: newPageNumber });
        },
        onRowsPerPageChange: (pageNumber, newRowsPerPage) => {
            setPagination({
                pageNumber,
                rowsPerPage: newRowsPerPage,
            });
        },
        onRowClick: (row: IPrivateLead) => {
            router.push(`${main_app_routes.app.leads.root}/manage/${row.leads_uuid}/${row.service_type}`)
        },
        onRowDoubleClick: (row: IPrivateLead) => {
            console.log("onRowClick data===>", row.leads_uuid)
        }

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


    // const hanndeCreateNewLeadClick = (leadState: ICreateLeadState) => {
    //     router.push(`${main_app_routes.app.leads.root}/manage?country=${leadState.country}&state=${leadState.state_or_province}&service_type=${leadState.services_type}`)
    // }

    const hanndeCreateNewLeadClick = () => {
        router.push(`${main_app_routes.app.leads.root}/manage`)
    }

    return (
        <DashboardContent metaTitle='Leads'>
            <CustomBreadcrumbs
                heading="Leads"
                links={[
                    { name: 'Leads', href: paths.dashboard.general.leads },
                    { name: 'List' },
                ]}
                action={
                    <Box sx={{ display: "flex", alignItems: 'center', gap: 1 }}>
                        <LeadUploadButton onSuccess={fetchList} />
                        <ButtonWithWriteAccess
                            module={MODULE_KEYS.LEADS}
                            onClick={hanndeCreateNewLeadClick}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            Create
                        </ButtonWithWriteAccess>
                    </Box>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <DataTableV2 {...tasksTableProps} />

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                {/* <MenuList>
                    {servicemultipleDataArray?.map((service) => (
                        <MenuItem
                            key={service.services_uuid}
                            onClick={() => hanndeCreateNewLeadClick(service.services_type)}
                        >
                            {service.services_type}
                        </MenuItem>
                    ))}

                </MenuList> */}
            </CustomPopover>


            {viewRetainerDocument.state &&
                <PreviewRetainerDocumentDialog
                    leadId={viewRetainerDocument.state}
                    open={true}
                    onClose={() => viewRetainerDocument.setState(null)}
                />}

            {openCreateLeadDialog.value &&
                <ChooseLeadServiceDialog
                    open={openCreateLeadDialog.value}
                    onClose={() => openCreateLeadDialog.onFalse()}
                    onSuccess={hanndeCreateNewLeadClick}
                />}
        </DashboardContent>
    )
}


export default PrivateLeadsTable