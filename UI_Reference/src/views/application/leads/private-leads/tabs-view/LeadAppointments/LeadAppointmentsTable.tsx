import React, { useEffect, useState } from 'react'
/* eslint-disable react-hooks/exhaustive-deps */
import type { IDocument, IStoreState } from 'src/redux';
import type { IDataTableV2Props } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';



import { ILoadState } from 'src/redux/store.enums';
import { DashboardContent } from 'src/layouts/dashboard'
import { useAppDispatch, useAppSelector, useRecordCountStore } from 'src/redux';
import { DataTableV2 } from 'src/mui-components/TableV2/DataTableV2';
import { useTableV2State } from 'src/mui-components/TableV2/hooks/useTableV2State';
import { DataTableV2RowRenderType } from 'src/mui-components/TableV2/interfaces/IDataTableV2Props';
import { clearMultipleDocumentStateSync, clearPrivateLeadsFullStateSync, createTabsWithRecordcounts, fetchMultipleDocumentForLeadsAsync, fetchSinglePrivateLeadWithArgsAsync } from 'src/redux/child-reducers';

import { useParams, useRouter } from 'src/routes/hooks';
import { DocumentStatusRenderer } from '../../../documents/components';
import { PopupButton, PopupWidget } from 'react-calendly';
import { CONFIG } from 'src/config-global';
import { Box, Button, Link, Typography, useTheme } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { calendlyFetchUserAppointmentsUsingEmail, IUserAppointment } from 'src/services/calendly-services';
import { capitalizeUnderScoreWords, capitalizeWords } from 'src/utils/format-word';


export const LeadAppointmentsTable = () => {
    const { uuid } = useParams() as { uuid?: string };
    const [pagination, setPagination] = React.useState({
        pageNumber: 1,
        rowsPerPage: 10,
    });
    const [appointmentList, setAppointmentList] = useState<IUserAppointment[]>([])
    const dispatch = useAppDispatch();
    const theme = useTheme()
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

    React.useEffect(() => {
        if (!singleleadInfo.email) return
        calendlyFetchUserAppointmentsUsingEmail(singleleadInfo.email).then((data) => {
            setAppointmentList(data)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [singleleadInfo.email]);



    const tasksTableProps: IDataTableV2Props = {
        rowsPerPageOptions: pagination.rowsPerPage,
        masterColumns: [
            {
                key: "status",
                headerName: "Status",
                fieldName: "status",
                renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
                width: '120px',
                isFirstColumnSticky: true,
                onRowCellRender: (value, row: IUserAppointment) =>
                    <DocumentStatusRenderer status={row.status as any} />
            },
            {
                key: "user_name",
                headerName: "Host Name",
                fieldName: "user_name",
                renderType: DataTableV2RowRenderType.DATE_TIME,
                enableSorting: true,
                onRowCellRender: (value, row: IUserAppointment) => {
                    return row.event_memberships.map((user) => {
                        return <Typography variant='body1'>{capitalizeUnderScoreWords(user.user_name)}</Typography>
                    })
                }


            },
            {
                key: "user_email",
                headerName: "Host Email",
                fieldName: "user_email",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                enableSorting: true,
                onRowCellRender: (value, row: IUserAppointment) => {
                    return row.event_memberships.map((user) => {
                        return <Typography variant='body1'>{capitalizeUnderScoreWords(user.user_email)}</Typography>
                    })
                }
            },
            {
                key: "start_time",
                headerName: "Start Time",
                fieldName: "start_time",
                renderType: DataTableV2RowRenderType.DATE_TIME,
                enableSorting: true,

            },
            {
                key: "end_time",
                headerName: "End Time",
                fieldName: "end_time",
                renderType: DataTableV2RowRenderType.DATE_TIME,
                enableSorting: true,
                turncateLength: 20
            },

            {
                key: "type",
                headerName: "Meeting Type",
                fieldName: "type",
                renderType: DataTableV2RowRenderType.TEXT_DARK,
                onRowCellRender: (value, row: IUserAppointment) =>
                    <Typography variant='body1'>{capitalizeUnderScoreWords(row.type)}</Typography>
            },
            {
                key: "join_url",
                headerName: "Join",
                fieldName: "join_url",
                renderType: DataTableV2RowRenderType.CUSTOM_RENDER,
                width: '120px',
                onRowCellRender: (value, row: IUserAppointment) =>
                    <Button variant='contained' onClick={() => {
                        const a = document.createElement("a");
                        a.href = row.join_url;
                        a.target = "_blank";
                        a.click();
                    }}>Join</Button>
            },

        ],
        tableTabProps: {
            selectedTab: tabs.selectedTab,
            tabs: tabs.tabs,
            onTabChange: (newSelectedTab) => {
                setSelectedTab(newSelectedTab);
            },
        },

        rows: appointmentList,

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

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSinglePrivateLeadWithArgsAsync({ uuid }))
    }, [uuid])



    useEffect(() => {
        return () => {
            dispatch(clearPrivateLeadsFullStateSync())
        }
    }, [])

    console.log("appointmentList ===>", appointmentList)
    return (
        <DashboardContent disablePadding metaTitle='Documents' sx={{ mt: 2 }}>
            <Box sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2
            }}>
                <PopupButton
                    url={`${CONFIG.calendlyEventType}?name=${singleleadInfo.applicant_first_name}&email=${singleleadInfo.email}`}
                    rootElement={document.getElementById("root") as HTMLElement}
                    text="Schedule an appointment"
                    styles={{
                        paddingInline: 8,
                        paddingBlock: 12,
                        borderRadius: 8,
                        cursor: "pointer",
                        border: 'none',
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: 700,
                        backgroundColor: theme.palette.mode === "light" ? "#1c252e" : "#fff",
                        color: theme.palette.mode === "light" ? "#fff" : "#1c252e",
                    }}

                />
            </Box>
            <DataTableV2 {...tasksTableProps} selectionMode='multiple' />
        </DashboardContent>
    )
}