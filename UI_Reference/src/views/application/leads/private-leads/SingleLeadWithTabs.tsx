import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { main_app_routes } from 'src/routes/paths';
import ManageSinglePrivateLead from './ManageSinglePrivateLead';
import { CommentModule } from 'src/sections/Comment/CommentModule';
import { SingleLeadActivity } from './tabs-view/LeadActivity/SingleLeadActivity';
import { useParams } from 'react-router';
import { CRSPointsCalculations, LeadReport, LeadSuggesions } from './tabs-view';
import { useSearchParams } from 'react-router-dom';
import { LeadAppointmentsTable } from './tabs-view/LeadAppointments/LeadAppointmentsTable';
import { RetainerAgreementsTable } from './tabs-view/RetainerAgreement/RetainerAgreementsTable';
import { AIReportSummary } from './tabs-view/AIReportSummary/AIReportSummary';

const TABS = [
    { value: 'LEAD_INFO', label: 'Lead Info', icon: <Iconify icon="solar:link-square-bold" width={24} /> },
    { value: 'CRS_POINTS', label: 'Points', icon: <Iconify icon="solar:book-bookmark-bold" width={24} /> },
    { value: 'SUGGESIONS', label: 'Suggestions', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
    { value: 'REPORT', label: 'Report', icon: <Iconify icon="solar:document-bold" width={24} /> },
    { value: 'RETAINER_DOC', label: 'Retainer Agreement', icon: <Iconify icon="solar:file-download-bold" width={24} /> },
    { value: 'APPOINTMENTS', label: 'Appointments', icon: <Iconify icon="solar:calendar-bold-duotone" width={24} /> },
    { value: 'ACTIVITY', label: 'Activity', icon: <Iconify icon="solar:tuning-linear" width={24} /> },
    { value: 'COMMENT', label: 'Comments', icon: <Iconify icon="solar:chat-round-line-line-duotone" width={24} /> },
];


const SingleLeadWithTabs = () => {
    const { uuid, service_type } = useParams() as { uuid?: string, service_type?: string };
    const [searchParams, setSearchParams] = useSearchParams();
    const [dynamicTabs, setDynamicTabs] = useState<{
        value: string;
        label: string;
        icon: JSX.Element;
    }[]>([]);
    const currentTab = searchParams.get('tab')
    const tabs = useTabs('LEAD_INFO');


    React.useEffect(() => {
        setDynamicTabs([
            { value: 'LEAD_INFO', label: 'Lead Info', icon: <Iconify icon="solar:link-square-bold" width={24} /> },
            ...(service_type !== "VISITOR" ? [
                { value: 'CRS_POINTS', label: 'Points', icon: <Iconify icon="solar:book-bookmark-bold" width={24} /> },
                { value: 'SUGGESIONS', label: 'Suggestions', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
                { value: 'REPORT', label: 'Report', icon: <Iconify icon="solar:document-bold" width={24} /> },
                { value: 'AI_REPORT', label: 'Ai Report', icon: <Iconify icon="solar:document-bold" width={24} /> },
            ] : []),
            { value: 'RETAINER_DOC', label: 'Retainer Agreement', icon: <Iconify icon="solar:file-download-bold" width={24} /> },
            { value: 'APPOINTMENTS', label: 'Appointments', icon: <Iconify icon="solar:calendar-bold-duotone" width={24} /> },
            { value: 'ACTIVITY', label: 'Activity', icon: <Iconify icon="solar:tuning-linear" width={24} /> },
            { value: 'COMMENT', label: 'Comments', icon: <Iconify icon="solar:chat-round-line-line-duotone" width={24} /> },
        ])
    }, [service_type]);

    React.useEffect(() => {
        const nativeEvent: any = new Event('click', { bubbles: true, cancelable: true });
        tabs.onChange(nativeEvent, currentTab || "LEAD_INFO")
    }, [currentTab]);

    const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
        setSearchParams({ 'tab': tabValue }); // Update the `tab` parameter
    };

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={`${uuid ? "Update" : "Create"} New Lead`}
                links={[
                    { name: 'Leads', href: main_app_routes.app.leads.root },
                    { name: `${uuid ? "Update" : "Create"} New Lead` },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Tabs value={tabs.value} onChange={handleTabChange} sx={{ mb: 3, }}>
                {dynamicTabs.map((tab) => (
                    <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                ))}
            </Tabs>


            {tabs.value === 'LEAD_INFO' && <ManageSinglePrivateLead />}
            {tabs.value === 'CRS_POINTS' && <CRSPointsCalculations />}
            {tabs.value === 'SUGGESIONS' && <LeadSuggesions />}
            {tabs.value === 'REPORT' && <LeadReport />}
            {tabs.value === 'AI_REPORT' && <AIReportSummary />}
            {tabs.value === 'RETAINER_DOC' && <RetainerAgreementsTable />}
            {tabs.value === 'APPOINTMENTS' && <LeadAppointmentsTable />}

            {tabs.value === 'COMMENT' && <CommentModule module_uuid={uuid || ""} module_name="LEAD" />}
            {tabs.value === 'ACTIVITY' && <SingleLeadActivity />}
        </DashboardContent>
    )
}
export default SingleLeadWithTabs