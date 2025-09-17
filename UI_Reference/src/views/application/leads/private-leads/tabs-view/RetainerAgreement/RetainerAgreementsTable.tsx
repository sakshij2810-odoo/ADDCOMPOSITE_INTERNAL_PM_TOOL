import React, { useState } from 'react'
/* eslint-disable react-hooks/exhaustive-deps */
import type { IDocument, IRetainerAgreement, IStoreState } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';

import { Button, Tooltip, Typography } from '@mui/material';


import { ILoadState } from 'src/redux/store.enums';
import { useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { StandardTableActions } from 'src/mui-components/StandardTableActions/StandardTableActions';
import { clearMultipleDocumentStateSync, clearPrivateLeadsFullStateSync, createTabsWithRecordcounts, defaultRetainerAgreement, fetchMultipleDocumentForLeadsAsync, fetchRetainerAgrewementWithArgsAsync, fetchSinglePrivateLeadWithArgsAsync, upsertSingleRetainerAgrewementWithCallbackAsync } from 'src/redux/child-reducers';

import { useParams, useRouter } from 'src/routes/hooks';
import { DocumentStatusRenderer, SignDocumentButton } from '../../../documents/components';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { CreateNewRetainerAgreementDailog } from './dialogs/CreateNewRetainerAgreementDailog';
import { PreviewRetainerAgreementDialog } from './dialogs/PreviewRetainerAgreementDialog';
import { downloadOrPreviewSingleFileAsync } from 'src/services/general-services';
import { removeUnderScore } from 'src/utils/format-word';
import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSetState } from 'src/hooks/use-set-state';
import { IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';

export const RetainerAgreementsTable = () => {
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
    } = useAppSelector((storeState: IStoreState) => storeState.leads.leads.single_lead_retainer_agreement_list);
    const {
        data: singleleadInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.leads.single_private_lead);


    const confirmDelete = useSetState<IRetainerAgreement | null>(null)


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
        dispatch(fetchRetainerAgrewementWithArgsAsync({ module: "LEAD", uuid }));
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
                onRowCellRender: (value, row: IRetainerAgreement) => {
                    return <StandardTableActions
                        onViewClick={() => setPreviewAgreement(row.file_path)}
                        onDownLoadClick={() => handleDownloadAgreement(row.file_path as string)}
                        {...(row.document_status === "DRAFT" && { onEditClick: () => setOpenUpsertDocumentDialog(row) })}
                        onDeleteClick={() => confirmDelete.setState(row)}
                    />
                }
            },

            {
                key: "status",
                headerName: "Document Status",
                fieldName: "status",
                renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
                width: '120px',
                onRowCellRender: (value, row: IRetainerAgreement) =>
                    <DocumentStatusRenderer status={row.document_status as any} />
            },
            {
                key: "view",
                headerName: "Email Status",
                fieldName: "",
                renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
                onRowCellRender: (value, row: IRetainerAgreement) =>
                    <SignDocumentButton lead={singleleadInfo} retainer={row} onSuccess={() => fetchList()} />
                ,
            },
            {
                key: "read_status",
                headerName: "Read Status",
                fieldName: "read_status",
                renderType: DataTableV2RowRenderType.CHIP_WARNING,
                width: '120px',
            },
            {
                key: "status",
                headerName: "Sign Status",
                fieldName: "status",
                renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
                onRowCellRender: (value, row: IRetainerAgreement) =>
                    <DocumentStatusRenderer status={row.signed_status as any} />
            },
            {
                key: "client_name",
                headerName: "Client Name",
                fieldName: "client_name",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,

            },
            {
                key: "service_type",
                headerName: "Service Type",
                fieldName: "service_type",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
                onRowCellRender: (value, row: IRetainerAgreement) =>
                    <Label variant="soft" color={"warning"}  >{removeUnderScore(row.service_type)}</Label>
            },
            {
                key: "service_sub_type",
                headerName: "Service Sub Type",
                fieldName: "service_sub_type",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
                onRowCellRender: (value, row: IRetainerAgreement) =>
                    <Label variant="soft" color={"warning"}  >{removeUnderScore(row.service_sub_type)}</Label>
            },
            {
                key: "retainer_type",
                headerName: "Retainer Type",
                fieldName: "retainer_type",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
                onRowCellRender: (value, row: IRetainerAgreement) =>
                    <Label variant="soft" color={"warning"}  >{removeUnderScore(row.retainer_type as string)}</Label>

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


    const handleDownloadAgreement = (filePath: string) => {
        downloadOrPreviewSingleFileAsync(filePath, true)
    }
    const handleDeleteAgreement = (retainer_doc: IRetainerAgreement) => {
        dispatch(upsertSingleRetainerAgrewementWithCallbackAsync({
            payload: {
                ...retainer_doc,
                status: "INACTIVE"
            }, onSuccess(isSuccess, data) {
                if (isSuccess && data) {
                    fetchList();
                }
            },
        })).finally(() => {
            confirmDelete.onResetState();
        })
    }

    return (
        <MuiStandardCard title={
            <>
                <Typography variant='h6'>Retainer Agreements</Typography>
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
                country: singleleadInfo.country,
                state_or_province: singleleadInfo.state_or_province,
                service_type: singleleadInfo.service_type,
                service_sub_type: singleleadInfo.service_sub_type as "LMIA",
                module_uuid: singleleadInfo.leads_uuid as string,
                module_name: "LEAD",
                client_email: singleleadInfo.email,
                client_contact_number: singleleadInfo.contact_number
            })}>Create New Agreement</Button>}
            divider sx={{ mt: 2 }}>
            {multipleDataArray.length === 0 ?
                <Typography variant='body1' textAlign="center">No data available</Typography>
                :
                <DataTableV2 {...tasksTableProps} selectionMode='multiple' />}
            {openUpsertDocumentDialog && (
                <CreateNewRetainerAgreementDailog
                    open={true}
                    data={openUpsertDocumentDialog}
                    onClose={() => setOpenUpsertDocumentDialog(null)}
                    onSaveSuccess={() => { fetchList(); setOpenUpsertDocumentDialog(null) }}
                />
            )}
            {previewAgreement && <PreviewRetainerAgreementDialog
                open={true}
                filePath={previewAgreement}
                onClose={() => setPreviewAgreement(null)}
            />}
            {confirmDelete.state && <ConfirmDialog
                open={true}
                onClose={() => confirmDelete.onResetState()}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete this document ?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            if (!confirmDelete.state) return
                            handleDeleteAgreement(confirmDelete.state);
                        }}
                    >
                        Delete
                    </Button>
                }
            />}
        </MuiStandardCard>
    )
}