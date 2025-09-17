import { Work } from '@mui/icons-material';
import { Grid, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { isArray, isObject } from 'lodash';
import React from 'react'
import { formatPhoneNumber } from 'react-phone-number-input';
import { Label } from 'recharts';
import { IEducationProfile, IWorkHistoryProfile } from 'src/redux';
import { ILeadAIReportSummary } from 'src/redux/child-reducers/leads/private-leads/sub-modules/ai-report-summary';
import { fDate } from 'src/utils/format-time';
import { capitalizeWords } from 'src/utils/format-word';

const applicantDetailsOrder = [
    "applicant_first_name",
    "applicant_last_name",
    "email",
    "contact_number",
    "applicant_date_of_birth",
    "nationality",
    "country_of_residence",
    "status_in_country",
    "applicant_sex",
    "marital_status",
    "leads_source",
    "specify",
    "time_to_contact",
]

const languageDetailsOrder = [
    "english_test_result_less_than_two_years",
    "english_exam_type",
    "english_ability_speaking",
    "english_ability_listening",
    "english_ability_reading",
    "english_ability_writing",

    "french_test_result_less_than_two_years",
    "french_language_test_type",
    "french_ability_speaking",
    "french_ability_listening",
    "french_ability_reading",
    "french_ability_writing",
]


const spouseDetailsOrder = [
    "spouse_first_name",
    "spouse_last_name",
    "spouse_date_of_birth",
    "spouse_sex",
]

const spouseLanguageDetailsOrder = [
    "spouse_english_test_result_less_than_two_years",
    "spouse_english_exam_type",
    "spouse_english_ability_speaking",
    "spouse_english_ability_listening",
    "spouse_english_ability_reading",
    "spouse_english_ability_writing",

    "spouse_french_test_result_less_than_two_years",
    "spouse_french_language_test_type",
    "spouse_french_ability_speaking",
    "spouse_french_ability_listening",
    "spouse_french_ability_reading",
    "spouse_french_ability_writing",
]

interface IApplicantDetailsViewProps {
    applicantDetails: ILeadAIReportSummary["lead_details"];
}

export const ApplicantDetailsView: React.FC<IApplicantDetailsViewProps> = ({ applicantDetails }) => {
    return (
        <>
            <Section>
                <Grid container spacing={2}>
                    <ReportDetailKeyValue label="applicant First Name" value={applicantDetails.applicant_first_name} />
                    <ReportDetailKeyValue label="applicant Last Name" value={applicantDetails.applicant_last_name ?? "-"} />
                    <ReportDetailKeyValue label="Applicant Sex" value={applicantDetails.applicant_sex ?? "-"} />
                    <ReportDetailKeyValue label="Email" value={applicantDetails.email ?? "-"} />
                    <ReportDetailKeyValue label="Contact Number" value={formatPhoneNumber(applicantDetails.contact_number) ?? "-"} />
                    <ReportDetailKeyValue label="Applicant Date of Birth" value={fDate(applicantDetails.applicant_date_of_birth) ?? "-"} />
                    <ReportDetailKeyValue label="Nationality" value={applicantDetails.nationality ?? "-"} />
                    <ReportDetailKeyValue label="Country of Residence" value={applicantDetails.country_of_residence ?? "-"} />
                    <ReportDetailKeyValue label="Status in Country" value={applicantDetails.status_in_country ?? "-"} />
                    <ReportDetailKeyValue label="Marital Status" value={applicantDetails.marital_status ?? "-"} />
                    <ReportDetailKeyValue label="Status in Country" value={applicantDetails.status_in_country ?? "-"} />
                    <ReportDetailKeyValue label="Leads Source" value={applicantDetails.leads_source ?? "-"} />
                    <ReportDetailKeyValue label="Specify" value={applicantDetails.specify ?? "-"} />
                    <ReportDetailKeyValue label="Time to Contact" value={applicantDetails.time_to_contact ?? "-"} />

                </Grid>
            </Section>

            {/* Applicant Education Details */}
            <Section sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>Applicant Education Details</Typography>
                <EducationProfileTable education={applicantDetails.education} />
            </Section>



            {/* Applicant Work History Details */}
            <Section sx={{ mt: 4 }}>
                <Typography variant="subtitle1">Applicant Work History Details</Typography>
                <WorkExperienceProfileTable workHistory={applicantDetails.work_history} />
            </Section>



            {/* Applicant Language Ability Details */}
            <Section sx={{ mt: 4 }}>
                <Typography variant="h6">Language Ability Details</Typography>
                <Typography variant="subtitle1">First Language</Typography>
                <Grid container spacing={2}>
                    <ReportDetailKeyValue label="Are Test Result Less Than Two Years" value={applicantDetails.english_test_result_less_than_two_years} col={6} />
                    {applicantDetails.english_test_result_less_than_two_years && (
                        <>
                            <ReportDetailKeyValue label="First Official Language" value={applicantDetails.english_language_test_type} col={6} />
                            <ReportDetailKeyValue label="Speaking" value={applicantDetails.english_ability_speaking} />
                            <ReportDetailKeyValue label="Listening" value={applicantDetails.english_ability_listening} />
                            <ReportDetailKeyValue label="Reading" value={applicantDetails.english_ability_reading} />
                            <ReportDetailKeyValue label="Writing" value={applicantDetails.english_ability_writing} />
                        </>
                    )}
                </Grid>
            </Section>


            <Section sx={{ mt: 4 }}>
                <Typography variant="subtitle1">Second Language</Typography>
                <Grid container spacing={2}>
                    <ReportDetailKeyValue label="Are Test Result Less Than Two Years" value={applicantDetails.french_test_result_less_than_two_years} col={6} />
                    {applicantDetails.french_test_result_less_than_two_years && (
                        <>
                            <ReportDetailKeyValue label="Second Official Language" value={applicantDetails.french_language_test_type} col={6} />
                            <ReportDetailKeyValue label="Speaking" value={applicantDetails.french_ability_speaking} />
                            <ReportDetailKeyValue label="Listening" value={applicantDetails.french_ability_listening} />
                            <ReportDetailKeyValue label="Reading" value={applicantDetails.french_ability_reading} />
                            <ReportDetailKeyValue label="Writing" value={applicantDetails.french_ability_writing} />
                        </>
                    )}
                </Grid>

            </Section>
        </>
    )
}


export const SpouseDetailsView: React.FC<IApplicantDetailsViewProps> = ({ applicantDetails }) => {
    return (
        <>
            <Section sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    <ReportDetailKeyValue label="Spouse First Name" value={applicantDetails.spouse_first_name} />
                    <ReportDetailKeyValue label="Spouse Last Name" value={applicantDetails.spouse_last_name ?? "-"} />
                    <ReportDetailKeyValue label="Spouse Sex" value={applicantDetails.spouse_sex ?? "-"} />
                    <ReportDetailKeyValue label="Spouse Date of Birth" value={fDate(applicantDetails.spouse_date_of_birth) ?? "-"} />

                    <Grid item xs={12} sm={12} md={12}> <Typography variant="subtitle1">Spouse Language Ability Details</Typography></Grid>
                    <ReportDetailKeyValue label="Are Test Result Less Than Two Years" value={applicantDetails.english_test_result_less_than_two_years} col={6} />
                    {applicantDetails.english_test_result_less_than_two_years && (
                        <>
                            <ReportDetailKeyValue label="First Official Language" value={applicantDetails.english_language_test_type} col={6} />
                            <ReportDetailKeyValue label="Speaking" value={applicantDetails.spouse_english_ability_speaking} />
                            <ReportDetailKeyValue label="Listening" value={applicantDetails.spouse_english_ability_listening} />
                            <ReportDetailKeyValue label="Reading" value={applicantDetails.spouse_english_ability_reading} />
                            <ReportDetailKeyValue label="Writing" value={applicantDetails.spouse_english_ability_writing} />
                        </>
                    )}
                </Grid>
            </Section>


            {/* Spouse Education Details */}
            <Section sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>Spouse Education Details</Typography>
                <EducationProfileTable education={applicantDetails.spouse_education} />
            </Section>


            {/* Spouse Work History Details */}
            <Section sx={{ mt: 4 }}>
                <Typography variant="subtitle1">Spouse Work History Details</Typography>
                <WorkExperienceProfileTable workHistory={applicantDetails.spouse_work_history} />
            </Section>

        </>
    )
}



const EducationProfileTable: React.FC<{ education: IEducationProfile[] }> = ({ education }) => {
    if (!education || education.length === 0) return <p>No education data available</p>;

    return (
        <Table size='small'>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>Qualification</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>From Date</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>To Date</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>School or University</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {education.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{capitalizeWords(item.qualification || "") || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{fDate(item.from) || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{fDate(item.to) || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{item.school_or_university || "-"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

const WorkExperienceProfileTable: React.FC<{ workHistory: IWorkHistoryProfile[] }> = ({ workHistory }) => {
    if (!workHistory || workHistory.length === 0) return <p>No work history data available</p>;

    return (
        <Table size='small'>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>Designation</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>Employement Type</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>From Date</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>To Date</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>Company Location</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>Location Type</TableCell>
                    <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>Work Description</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {workHistory.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{item.designation || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{capitalizeWords(item.employement_type || "") || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{fDate(item.from) || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{fDate(item.to) || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{item.company_location || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{capitalizeWords(item.location_type || "") || "-"}</TableCell>
                        <TableCell sx={{ border: "1px solid #e0e0e0 !important" }}>{item.work_description || "-"}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}



export const ReportDetailKeyValue: React.FC<{ label: string; value: any, col?: number }> = ({ label, value, col }) => {
    return (
        <Grid item xs={12} sm={6} md={col || 3}>
            <Typography variant="subtitle2" color="textSecondary">
                {label}
            </Typography>
            <Typography>{value ?? "-"}</Typography>
        </Grid>
    );
}


export const formatLabel = (key: string) => key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

export const KeyValueList: React.FC<{ data: any; indent?: number }> = ({ data, indent = 0 }) => {
    return (
        <>
            {Object.entries(data).map(([key, value]) => {
                if (isArray(value)) return null;
                if (isObject(value)) {
                    return (
                        <Grid item xs={12} key={key}>
                            <Typography variant="subtitle1" sx={{ mt: 2, ml: indent }}>
                                {formatLabel(key)}
                            </Typography>
                            <Grid container spacing={2}>
                                <KeyValueList data={value} indent={indent + 2} />
                            </Grid>
                        </Grid>
                    );
                }
                return (
                    <ReportDetailKeyValue
                        key={key}
                        label={formatLabel(key)}
                        value={value}
                    />
                );
            })}
        </>
    );
};



export const Section = styled('section')({
    pageBreakInside: 'avoid',  /* Older browsers */
    breakInside: 'avoid',       /* Modern browsers */
    /* optionally */
    WebkitRegionBreakInside: 'avoid' /* Safari */
});
