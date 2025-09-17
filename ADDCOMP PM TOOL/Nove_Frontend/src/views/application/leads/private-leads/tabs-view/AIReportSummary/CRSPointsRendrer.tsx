import { Box, Table, TableBody, TableCell, TableHead, Typography } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableContainer } from "@mui/material";
import React, { useState } from "react";
import { ILeadAIReportSummary } from "src/redux/child-reducers/leads/private-leads/sub-modules/ai-report-summary";
import { formatLabel } from "./ApplicantDetailsView";




export const CRSPointsRendrer: React.FC<{ data: ILeadAIReportSummary["crs_breakdown"] }> = ({ data }) => {
    const sections = [
        {
            title: "Core Human Capital Factor",
            rows: [
                { label: "Age", value: data.core_human_capital_factor.age },
                { label: "Level of Education", value: data.core_human_capital_factor.level_of_education },
                { label: "First Official Language", value: data.core_human_capital_factor.official_languages.first_official_language },
                { label: "Second Official Language", value: data.core_human_capital_factor.official_languages.second_official_language },
                { label: "Canadian Work Experience", value: data.core_human_capital_factor.canadian_work_experience }
            ],
            subtotal: data.core_human_capital_factor.subtotal
        },
        {
            title: "Spouse Factor",
            rows: [
                { label: "Level of Education", value: data.spouse_factor.level_of_education },
                { label: "First Official Language", value: data.spouse_factor.first_official_language },
                { label: "Canadian Work Experience", value: data.spouse_factor.canadian_work_experience }
            ],
            subtotal: data.spouse_factor.subtotal
        },
        {
            title: "Skill Transferability Factor",
            rows: [
                { label: "Canadian Work Experience and Education", value: data.skill_transferability_factor.education.canadian_work_experience_and_education },
                { label: "Official Language Proficiency and Education", value: data.skill_transferability_factor.education.official_language_proficiency_and_education },
                { label: "Canadian and Foreign Work Experience", value: data.skill_transferability_factor.foreign_work_experience.canadian_and_foreign_work_experience },
                { label: "Official Language Proficiency and Foreign Work Experience", value: data.skill_transferability_factor.foreign_work_experience.official_language_proficiency_and_foreign_work_experience },
                { label: "Certificate of Qualification", value: data.skill_transferability_factor.certificate_of_qualification }
            ],
            subtotal: data.skill_transferability_factor.subtotal
        },
        {
            title: "Additional Points",
            rows: [
                { label: "Job Offer", value: data.additional_points.job_offer },
                { label: "Study in Canada", value: data.additional_points.study_in_canada },
                { label: "Sibling in Canada", value: data.additional_points.sibling_in_canada },
                { label: "Provincial Nomination", value: data.additional_points.provincial_nomination },
                { label: "French Language Skills", value: data.additional_points.french_language_skills }
            ],
            subtotal: data.additional_points.subtotal
        },
    ];

    return (
        <Table size="small" sx={{ border: "1px solid #e0e0e0" }}>
            <TableHead>
                <TableRow sx={{
                    pageBreakInside: 'avoid',  /* Older browsers */
                    breakInside: 'avoid',       /* Modern browsers */
                    /* optionally */
                    WebkitRegionBreakInside: 'avoid' /* Safari */
                }}>
                    <TableCell sx={{ border: "1px solid", borderColor: "#e0e0e0 !important" }}><b>Section</b></TableCell>
                    <TableCell sx={{ border: "1px solid", borderColor: "#e0e0e0 !important" }}><b>Factor</b></TableCell>
                    <TableCell align="right" sx={{ border: "1px solid", borderColor: "#e0e0e0 !important" }}><b>Points</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sections.map((section, sIdx) => (
                    <React.Fragment key={sIdx}>
                        {section.rows.map((row, rIdx) => (
                            <TableRow key={rIdx} sx={{
                                pageBreakInside: 'avoid',  /* Older browsers */
                                breakInside: 'avoid',       /* Modern browsers */
                                /* optionally */
                                WebkitRegionBreakInside: 'avoid' /* Safari */
                            }}>
                                {rIdx === 0 && (
                                    <TableCell
                                        rowSpan={section.rows.length + 1}
                                        sx={{ fontWeight: "bold", border: "1px solid #e0e0e0" }}
                                    >
                                        {section.title}
                                    </TableCell>
                                )}
                                <TableCell sx={{ border: "1px solid #e0e0e0" }}>{row.label}</TableCell>
                                <TableCell sx={{ border: "1px solid #e0e0e0" }} align="right">{row.value}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{
                            pageBreakInside: 'avoid',  /* Older browsers */
                            breakInside: 'avoid',       /* Modern browsers */
                            /* optionally */
                            WebkitRegionBreakInside: 'avoid' /* Safari */
                        }}>
                            <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid #e0e0e0" }}>Subtotal</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid #e0e0e0" }}>
                                {section.subtotal}
                            </TableCell>
                        </TableRow>
                    </React.Fragment>
                ))}

                <TableRow sx={{
                    pageBreakInside: 'avoid',  /* Older browsers */
                    breakInside: 'avoid',       /* Modern browsers */
                    /* optionally */
                    WebkitRegionBreakInside: 'avoid' /* Safari */
                }}>
                    <TableCell colSpan={2} sx={{ fontWeight: "bold", textAlign: "right" }}>TOTAL</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {data.total}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
};

