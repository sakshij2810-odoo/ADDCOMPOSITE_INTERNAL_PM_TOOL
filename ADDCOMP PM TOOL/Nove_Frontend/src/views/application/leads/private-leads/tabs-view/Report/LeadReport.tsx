import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { clearSinglePrivateLeadStateSync, fetchSingleLeadReportWithArgsAsync, fetchSingleLeadSuggesionsWithArgsAsync, ILoadState, useAppDispatch, useAppStore } from 'src/redux';
import { downloadLeadReportPdfAync } from 'src/services';

export const LeadReport = () => {
    // ----------------------------------------- Hooks -----------------------------------------
    const { uuid } = useParams() as { uuid?: string };
    const dispatch = useAppDispatch()
    const {
        data: leadReport,
        loading
    } = useAppStore().leads.leads.single_lead_report;
    const [leadRpoertData, setleadRpoertData] = useState<String | null>(null)

    // ----------------------------------------- State -----------------------------------------
    const [isDownLoading, setIsDownLoading] = useState(false)


    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleLeadReportWithArgsAsync(uuid))
        return () => {
            dispatch(clearSinglePrivateLeadStateSync())
        }
    }, [uuid])

    const handleReportDownloadClick = async () => {
        if (!uuid) return
        setIsDownLoading(true)
        await downloadLeadReportPdfAync(uuid)
        setIsDownLoading(false)
    }

    useEffect(() => {
        setleadRpoertData(leadReport)
        executeScripts(leadReport)
        setTimeout(() => {
            executeScripts(leadReport)
        }, 500)
    }, [leadReport])

    const executeScripts = (html: any) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Find all <script> tags in the response
        const scriptTags = tempDiv.querySelectorAll("script");

        scriptTags.forEach((script) => {
            const newScript = document.createElement("script");
            if (script.src) {
                // If script has a src, load it dynamically
                newScript.src = script.src;
                newScript.async = true;
                document.body.appendChild(newScript);
            } else {
                // If inline script, execute it
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
            }
        });
    };

    return (
        <DashboardContent metaTitle='Lead Report' disablePadding loading={ILoadState.pending === loading}>
            <MuiStandardCard title='Overall Report' divider sx={{ mt: 2 }} rightHeading={
                <LoadingButton
                    variant='contained' disabled={!uuid}
                    loading={isDownLoading}
                    onClick={handleReportDownloadClick}>Download Report</LoadingButton>
            } >
                {leadRpoertData && <div dangerouslySetInnerHTML={{ __html: leadRpoertData as string }} />}
            </MuiStandardCard>
        </DashboardContent>
    )
}
