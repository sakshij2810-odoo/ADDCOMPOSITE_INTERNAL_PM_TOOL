import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { clearSingleAIReportSummaryStateSync, closeLoaderWithMessage, closeLoadingDialog, fetchSingleLeadReportAISummaryWithArgsAsync, ILoadState, openLoaderWithMessage, openLoadingDialog, regenerateSingleLeadReportAISummaryWithCallbackAsync, useAppDispatch, useAppStore } from 'src/redux';
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
import { ApplicantDetailsView, KeyValueList, SpouseDetailsView } from './ApplicantDetailsView';
import { CRSPointsRendrer } from './CRSPointsRendrer';
import html2pdf from "html2pdf.js";

export const AIReportSummary = () => {
    const { uuid } = useParams() as { uuid?: string };
    const dispatch = useAppDispatch()
    const {
        data: leadReport,
        loading
    } = useAppStore().leads.leads.single_lead_ai_report_summary;

    const mainRef = useRef<HTMLDivElement>(null);
    const chartPageRef = useRef<HTMLDivElement>(null);
    const crsPointsPageRef = useRef<HTMLDivElement>(null);
    const spousePageRef = useRef<HTMLDivElement>(null);

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


    const handleReportDownloadClick = async () => {
        try {
            console.log("handleReportDownloadClick Start");
            dispatch(openLoadingDialog("Generating PDF report..."));

            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentWidth = pageWidth - margin * 2;
            const contentHeight = pageHeight - margin * 2;

            const addCanvasToPDF = async (element: HTMLElement, isFirstPage = false) => {
                const canvas = await html2canvas(element, {
                    scale: 3, // Higher = better quality
                    useCORS: true,
                    backgroundColor: "#fff",
                });

                const imgHeight = (canvas.height * contentWidth) / canvas.width;
                const pageCanvasHeight = (canvas.width * contentHeight) / contentWidth;

                let renderedHeight = 0;
                const pageCanvas = document.createElement("canvas");
                pageCanvas.width = canvas.width;
                pageCanvas.height = pageCanvasHeight;
                const pageCtx = pageCanvas.getContext("2d")!;

                while (renderedHeight < canvas.height) {
                    pageCtx.clearRect(0, 0, canvas.width, pageCanvasHeight);
                    pageCtx.drawImage(
                        canvas,
                        0,
                        renderedHeight,
                        canvas.width,
                        pageCanvasHeight,
                        0,
                        0,
                        canvas.width,
                        pageCanvasHeight
                    );

                    const chunkImgData = pageCanvas.toDataURL("image/png");
                    if (!isFirstPage || renderedHeight > 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(chunkImgData, "PNG", margin, margin, contentWidth, contentHeight);

                    renderedHeight += pageCanvasHeight;
                    isFirstPage = false; // Only first loop for very first element
                }
            };

            // Pages in order
            if (mainRef.current) {
                await addCanvasToPDF(mainRef.current, true);
            }
            if (spousePageRef.current) {
                await addCanvasToPDF(spousePageRef.current);
            }
            if (crsPointsPageRef.current) {
                await addCanvasToPDF(crsPointsPageRef.current);
            }
            if (chartPageRef.current) {
                await addCanvasToPDF(chartPageRef.current);
            }

            pdf.save("lead_summary_report.pdf");
            console.log("handleReportDownloadClick end");
        } catch (error) {
            console.error("PDF generation failed", error);
        } finally {
            dispatch(closeLoadingDialog());
        }
    };


    const handleReportDownloadClickV2 = () => {
        const refs: Array<React.RefObject<HTMLDivElement>> = [
            mainRef,
            spousePageRef,
            crsPointsPageRef,
            chartPageRef
        ];

        const container = document.createElement("div");

        refs
            .map(ref => ref.current)
            .filter((el): el is HTMLDivElement => !!el)
            .forEach((page, index, arr) => {
                const clone = page.cloneNode(true) as HTMLDivElement;

                // Global PDF-friendly styles
                Object.assign(clone.style, {
                    fontSize: "10px",
                    padding: "12px",
                    boxSizing: "border-box",
                    width: "100%"
                });

                // Make charts responsive
                clone.querySelectorAll("canvas, svg").forEach(chart => {
                    Object.assign(chart as HTMLElement, {
                        style: { maxWidth: "100%", height: "auto" }
                    });
                });

                container.appendChild(clone);

                // Add page break except for the last page
                if (index < arr.length - 1) {
                    const breakDiv = document.createElement("div");
                    breakDiv.style.breakAfter = "page";
                    breakDiv.style.pageBreakAfter = "always";
                    container.appendChild(breakDiv);
                }
            });

        html2pdf()
            .set({
                margin: 0,
                filename: "export.pdf",
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                pagebreak: { mode: ["avoid-all", "css", "legacy"] }
            })
            .from(container)
            .save();
    };



    return (
        <DashboardContent metaTitle='Lead Report Summary' disablePadding loading={ILoadState.pending === loading}>
            <MuiStandardCard title='AI Report Summary' divider sx={{ mt: 2 }} rightHeading={
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant='contained' disabled={!uuid}
                        onClick={handleRegenerateClick}
                    >Re-generate</Button>

                    <LoadingButton
                        variant='contained' disabled={!uuid}
                        // loading={isDownLoading}
                        onClick={handleReportDownloadClickV2}
                    >Download</LoadingButton>
                </Box>

            } >
                {!leadReport && <Typography variant="h5" gutterBottom>No Report Found...!</Typography>}
                {leadReport && (
                    <Box sx={{ p: 3 }}>
                        {/* Page 1: Main Content */}
                        <div ref={mainRef}>
                            <Paper sx={{ p: 3, mb: 4 }} elevation={5}>
                                <Typography variant="h4" gutterBottom>CRS Assessment Report</Typography>
                                <Divider />
                                <ApplicantDetailsView applicantDetails={leadReport.lead_details} />
                            </Paper>
                        </div>

                        {/* Page 2: Spouse Content */}
                        {leadReport.lead_details.marital_status === "MARRIED" && (
                            <div ref={spousePageRef}>
                                <Paper sx={{ p: 3, mb: 4 }} elevation={5}>
                                    <SpouseDetailsView applicantDetails={leadReport.lead_details} />
                                </Paper>
                            </div>
                        )}

                        {/* Page 3: CRS Content */}
                        <div ref={crsPointsPageRef}>
                            <Paper sx={{ p: 3 }} elevation={5}>
                                <Typography variant="h6" gutterBottom>CRS Breakdown</Typography>
                                <CRSPointsRendrer data={leadReport.crs_breakdown} />

                                <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Eligibility</Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(leadReport.eligibility).map(([key, value]) => (
                                        <Grid item xs={12} sm={6} md={3} key={key}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </Typography>
                                            <Typography>{value}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>

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
                            </Paper>

                        </div>

                        {/* Page 4: Bar Chart */}
                        <div ref={chartPageRef} style={{ width: "100%", marginTop: 4 }}>
                            <Paper sx={{ p: 3 }} elevation={5}>
                                <Typography variant="h6" gutterBottom>Last 10 CRS Draws</Typography>
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
                        </div>
                    </Box>
                )}

            </MuiStandardCard>
        </DashboardContent>
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