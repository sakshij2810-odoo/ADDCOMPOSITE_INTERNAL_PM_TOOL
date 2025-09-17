import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, makeStyles, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import {
    clearSingleAIReportSummaryStateSync, closeLoaderWithMessage, closeLoadingDialog,
    fetchSingleLeadReportAISummaryWithArgsAsync, ILoadState, openLoaderWithMessage,
    openLoadingDialog, regenerateSingleLeadReportAISummaryWithCallbackAsync, useAppDispatch,
    useAppStore
} from 'src/redux';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Divider } from '@mui/material';
import { ApplicantDetailsView, KeyValueList, Section, SpouseDetailsView } from './ApplicantDetailsView';
import { CRSPointsRendrer } from './CRSPointsRendrer';
import html2pdf from "html2pdf.js";
import { Margin, usePDF } from "react-to-pdf";
import { styled } from '@mui/material';
import { keyBy } from 'src/utils/helper';



export const AIReportSummary = () => {
    const { uuid } = useParams() as { uuid?: string };
    const dispatch = useAppDispatch()
    const {
        data: leadReport,
        loading
    } = useAppStore().leads.leads.single_lead_ai_report_summary;

    const { toPDF, targetRef } = usePDF({
        method: "save",
        filename: "ai_report_summary.pdf",
        page: { margin: Margin.MEDIUM },
        overrides: {
            pdf: {
                compress: true
            },
            canvas: {
                useCORS: true
            }
        },
    });

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleLeadReportAISummaryWithArgsAsync({ uuid }))
        return () => {
            dispatch(clearSingleAIReportSummaryStateSync())
        }
    }, [uuid])

    const handleRegenerateClick = () => {
        if (!uuid) return alert("Lead Id not available...!");
        dispatch(regenerateSingleLeadReportAISummaryWithCallbackAsync({
            payload: {
                leads_uuid: uuid
            },
            onSuccess(isSuccess, data) {
                if (isSuccess) dispatch(fetchSingleLeadReportAISummaryWithArgsAsync({ uuid }))
            },
        }))
    }

    return (
        <DashboardContent metaTitle='Lead Report Summary' disablePadding loading={ILoadState.pending === loading}>
            <MuiStandardCard title='AI Report Summary' divider sx={{ mt: 2 }} rightHeading={
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant='contained' disabled={!uuid}
                        onClick={handleRegenerateClick}
                    >Re-generate</Button>

                    <Button variant='contained' onClick={() => toPDF()}>Download</Button>
                </Box>

            } >
                {!leadReport && <Typography variant="h5" gutterBottom>No Report Found...!</Typography>}
                {leadReport && (
                    <Paper sx={{ p: 3 }} elevation={5} ref={targetRef}>
                        {/* Page 1: Main Content */}

                        <Typography variant="h4" gutterBottom>CRS Assessment Report</Typography>
                        <Divider />
                        <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Applicant Details</Typography>
                        <ApplicantDetailsView applicantDetails={leadReport.lead_details} />

                        {/* Page 2: Spouse Content */}
                        {leadReport.lead_details.marital_status === "MARRIED" && (
                            <>
                                <Typography variant="h6" sx={{ mt: 4 }}>Spouse Details</Typography>
                                <SpouseDetailsView applicantDetails={leadReport.lead_details} />
                            </>

                        )}

                        {/* Page 3: CRS Content */}
                        <Section sx={{ mt: 4 }}>
                            <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>CRS Breakdown</Typography>
                            <CRSPointsRendrer data={leadReport.crs_breakdown} />
                        </Section>
                        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Eligibility</Typography>
                        <Grid container spacing={2}>
                            {Object.entries(leadReport.eligibility).map(([key, value]) => (
                                <Grid item xs={12} sm={6} md={3} key={key}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </Typography>
                                    <Typography>{value || "-"}</Typography>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>FSW Eligibility & Scope</Typography>
                        <Grid container spacing={2}>
                            {Object.entries(leadReport.fsw_eligibility_and_scope).map(([key, value]) => (
                                <Grid item xs={12} sm={6} md={3} key={key}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </Typography>
                                    <Typography>{value}</Typography>
                                </Grid>
                            ))}
                        </Grid>

                        {leadReport.oinp_breakdown && (
                            <>
                                <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>OINP Breakdown</Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(leadReport.oinp_breakdown.job_offer_points).filter(([key, value]) => key !== "oinp_subtotal").map(([key, value]) => (
                                        <Grid item xs={12} sm={6} md={3} key={key}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </Typography>
                                            <Typography>{value}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}

                        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Recommendations</Typography>
                        <Grid container spacing={2}>
                            {Object.entries(leadReport.recommendations).map(([key, value]) => (
                                <Grid item xs={12} md={6} key={key}>
                                    <Typography fontSize={14} variant="subtitle2" color="textSecondary">
                                        {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </Typography>
                                    <Typography fontSize={14} variant='body1' fontWeight={500}>{value}</Typography>
                                </Grid>
                            ))}
                        </Grid>


                        <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Last 10 CRS Draws</Typography>
                        {/* Bar Chart */}
                        <Box sx={{ height: 300, mt: 4 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={leadReport.last_ten_crs_draws}
                                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="draw" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="cutoff" fill="#3b82f6" name="CRS Cutoff Score" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>

                        {/* Bar Chart */}
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={leadReport.last_ten_crs_draws}
                                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="draw" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ITAs" fill="#10b981" name="ITAs Issued" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                )}

            </MuiStandardCard>
        </DashboardContent >
    )
}


{/* <Grid container spacing={2}>
                                    {Object.entries(leadReport.lead_details).map(([key, value]) => {
                                        if (isArray(value) || isObject(value)) return <></>; // Skip arrays and objects
                                        return (<Grid item xs={12} sm={6} md={4} key={key}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </Typography>
                                            <Typography>{value}</Typography>
                                        </Grid>
                                        )
                                    })}
                                </Grid> */}