import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { useParams } from 'src/routes/hooks';
import { main_app_routes } from 'src/routes/paths';
import QuestionnaireTableView from './document-checklist/QuestionnaireTableView';
import ServicesTableView from './services/ServicesTableView';
import { ITab, useTabsSecurity } from 'src/security/hooks/useTabsSecurity';
import { MODULE_KEYS } from 'src/constants/enums';


const TABS: ITab[] = [
    {
        value: 'DOCUMENT_CHECKLIST',
        label: 'Document Checklist',
        module: MODULE_KEYS.QUESTIONNAIRE,
        icon: <Iconify icon="solar:link-square-bold" width={24} />
    },
    {
        value: 'SERVICES',
        label: 'Services',
        module: MODULE_KEYS.SERVICE,
        icon: <Iconify icon="solar:file-download-bold" width={24} />
    },

];


const DocumentsAndServiceTabView = () => {
    const { uuid, service_type } = useParams() as { uuid?: string, service_type?: string };
    const accessibleTabs = useTabsSecurity(TABS)

    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get('tab')
    const tabs = useTabs(accessibleTabs[0]?.value);

    React.useEffect(() => {
        const nativeEvent: any = new Event('click', { bubbles: true, cancelable: true });
        tabs.onChange(nativeEvent, currentTab || accessibleTabs[0]?.value)
    }, [currentTab]);

    const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
        setSearchParams({ 'tab': tabValue }); // Update the `tab` parameter
    };

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={`Documents And Services`}
                disableRoot
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Tabs value={tabs.value} onChange={handleTabChange} sx={{ mb: 3, }}>
                {TABS.map((tab) => (
                    <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                ))}
            </Tabs>

            {tabs.value === 'DOCUMENT_CHECKLIST' && <QuestionnaireTableView />}
            {tabs.value === 'SERVICES' && <ServicesTableView />}
        </DashboardContent>
    )
}
export default DocumentsAndServiceTabView