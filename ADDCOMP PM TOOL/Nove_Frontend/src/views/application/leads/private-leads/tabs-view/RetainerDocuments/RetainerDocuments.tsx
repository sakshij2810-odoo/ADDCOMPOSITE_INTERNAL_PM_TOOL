import React, { useState } from 'react'
/* eslint-disable react-hooks/exhaustive-deps */
import type { IDocument, IRetainerAgreement, IStoreState } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import { Button, IconButton, Tooltip, Typography } from '@mui/material';


import { ILoadState } from 'src/redux/store.enums';
import { useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { clearMultipleDocumentStateSync, clearPrivateLeadsFullStateSync, createTabsWithRecordcounts, defaultRetainerAgreement, fetchMultipleDocumentForLeadsAsync, fetchSinglePrivateLeadWithArgsAsync } from 'src/redux/child-reducers';

import { useParams, useRouter } from 'src/routes/hooks';
import { DocumentStatusRenderer } from '../../../documents/components';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { CreateNewRetainerAgreementDailog } from '../RetainerAgreement/dialogs/CreateNewRetainerAgreementDailog';
import { Refresh } from '@mui/icons-material';

export const RetainerDocumentsTable = () => {
    const { uuid } = useParams() as { uuid?: string };
    const [pagination, setPagination] = React.useState({
        pageNumber: 1,
        rowsPerPage: 10,
    });
    const [openUpsertDocumentDialog, setOpenUpsertDocumentDialog] = useState<IRetainerAgreement | null>(null)
    const router = useRouter();
    const [previewAgreement, setPreviewAgreement] = useState<string | null>(null)

    const dispatch = useAppDispatch();
    const {
        data: recordCountArray,
        loading: recordCountLoading
    } = useRecordCountStore();

    const {
        data: multipleDataArray,
        count: totalCount,
        loading: dataLoading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.documents.multiple_documents_list);
    const {
        data: singleleadInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.leads.single_private_lead);
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
        if (!uuid) return
        dispatch(fetchSinglePrivateLeadWithArgsAsync({ uuid }))
        dispatch(fetchMultipleDocumentForLeadsAsync(uuid));
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
        totalRecords: totalCount,
        rowsPerPageOptions: pagination.rowsPerPage,
        isDataLoading: dataLoading === ILoadState.pending,
        masterColumns: [
            {
                key: "view",
                headerName: "Actions",
                fieldName: "",
                renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
                isFirstColumnSticky: true,
                onRowCellRender: (value, row: IRetainerAgreement) =>
                    <StandardTableActions
                        onViewClick={() => setPreviewAgreement(row.file_path)}
                        onDownLoadClick={() => { }}
                        onEditClick={() => setOpenUpsertDocumentDialog(row)}
                    />
                ,
            },
            {
                key: "status",
                headerName: "Status",
                fieldName: "status",
                renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
                width: '120px',
                isFirstColumnSticky: true,
                onRowCellRender: (value, row: IDocument) =>
                    <DocumentStatusRenderer status={row.status} />
            },
            {
                key: "document_code",
                headerName: "Document Code",
                fieldName: "document_code",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "signer_name",
                headerName: "Signer Name",
                fieldName: "signer_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
                turncateLength: 20
            },
            {
                key: "email",
                headerName: "Signer Email",
                fieldName: "email",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
            },
            {
                key: "send_status",
                headerName: "Send Status",
                fieldName: "send_status",
                renderType: DataTableV2RowRenderType.CHIP_WARNING,
                width: '120px',

            },
            {
                key: "read_status",
                headerName: "Read Status",
                fieldName: "read_status",
                renderType: DataTableV2RowRenderType.CHIP_WARNING,
                width: '120px',
            },

            {
                key: "signed_at",
                headerName: "Signed At",
                fieldName: "signed_at",
                enableSorting: true,
                renderType: DataTableV2RowRenderType.DATE_TIME,
            },
            {
                key: "expired",
                headerName: "Expiry Date",
                fieldName: "expired",
                enableSorting: true,
                renderType: DataTableV2RowRenderType.DATE_TIME,
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
            {
                key: "read_status",
                headerName: "Original Document",
                fieldName: "read_status",
                renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
                onRowCellRender: (value, row: IDocument) =>
                    <Button variant='contained'>View</Button>
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
                { label: "Dead", value: "DEAD", variant: "error" },
                { label: "Opportunity", value: "OPPORTUNITY", variant: "grey" },
            ],
            recordCountArray
        );

        setTableTabs(tabsData);
    }, [recordCountArray]);


    React.useEffect(() => {
        return () => {
            dispatch(clearMultipleDocumentStateSync());
            dispatch(clearPrivateLeadsFullStateSync())
        }
    }, [dispatch]);


    return (
        <MuiStandardCard title={
            <>
                <Typography variant='h6'>Retainerxc Agreements</Typography>
                <Tooltip title="Refresh">
                    <IconButton onClick={fetchList}>
                        <Refresh />
                    </IconButton>
                </Tooltip>
            </>
        }
            rightHeading={<Button variant='contained' onClick={() => setOpenUpsertDocumentDialog({
                ...defaultRetainerAgreement,
                client_name: (`${singleleadInfo.applicant_first_name} ${singleleadInfo.applicant_last_name || ""}`).trim(),
                service_type: singleleadInfo.service_type,
                service_sub_type: singleleadInfo.service_sub_type as "LMIA",
                module_uuid: singleleadInfo.leads_uuid as string,
                module_name: "LEAD",
            })}>Create New Agreement</Button>}
            divider sx={{ mt: 2 }}>
            <DataTableV2 {...tasksTableProps} selectionMode='multiple' />


            {openUpsertDocumentDialog && (
                <CreateNewRetainerAgreementDailog
                    open={true}
                    data={openUpsertDocumentDialog}
                    onClose={() => setOpenUpsertDocumentDialog(null)}
                    onSaveSuccess={() => fetchList()}
                />
            )}

        </MuiStandardCard>
    )
}