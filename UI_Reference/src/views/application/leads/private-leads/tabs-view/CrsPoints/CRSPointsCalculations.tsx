import React, { useEffect } from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { clearPrivateLeadsFullStateSync, clearSinglePrivateLeadStateSync, defaultCRSPointCalulations, fetchSinglePrivateLeadWithArgsAsync, ICRSPointCalulations, ILoadState, useAppDispatch, useAppStore } from 'src/redux'
import { Box, Typography } from '@mui/material'
import { useParams } from 'react-router'
import { DashboardContent } from 'src/layouts/dashboard'

const CRSTitle: React.FC<{ title: string }> = ({ title }) => {
    return <Typography variant='h6' sx={{ mt: 2 }}>{title}</Typography>
}

interface ICRSPointsCalculationsProps {
    applicant_crs_points: ICRSPointCalulations
}

export const CRSPointsCalculations: React.FC<{}> = (props) => {
    const { uuid } = useParams() as { uuid?: string };
    const dispatch = useAppDispatch()
    const {
        data: singleleadInfo,
        loading
    } = useAppStore().leads.leads.single_private_lead;

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSinglePrivateLeadWithArgsAsync({ uuid }))
    }, [uuid])


    useEffect(() => {
        return () => {
            dispatch(clearPrivateLeadsFullStateSync())
        }
    }, [])

    const crs_points = singleleadInfo?.applicant_crs_points || defaultCRSPointCalulations
    const chcFactor = crs_points.core_human_capital_factor
    const sFactor = crs_points.spouse_factor
    const stFactor = crs_points.skill_transferbility_factor
    const adPoints = crs_points.additional_point
    const crsGrandPointsTotal = crs_points.comprehensive_ranking_system_formula_grand_total
    const totalPoints = crs_points.total

    const oinpPoints = singleleadInfo?.applicant_oinp_points

    return (
        <DashboardContent metaTitle='CRS Point Calculations' disablePadding loading={ILoadState.pending === loading}>
            <MuiStandardCard title='CRS Point Calculations' divider sx={{ mt: 2 }} >

                <CRSTitle title="Core/Human capital factors" />
                <Box px={2} borderBottom={1} borderColor={"GrayText"}>
                    <Typography variant='body2'>{`Age = ${chcFactor.age}`}</Typography>
                    <Typography variant='body2'>{`Level of education = ${chcFactor.level_of_education}`}</Typography>
                    <Typography variant='body2'>{`Official Languages = ${chcFactor.official_languages_subtotal || 0}`}</Typography>
                    <Box px={2}>
                        <Typography variant='body2' fontStyle={"italic"}>{`First Official Language = ${chcFactor.official_languages.first_official_language}`}</Typography>
                        <Typography variant='body2' fontStyle={"italic"}>{`Second Official Language = ${chcFactor.official_languages.second_official_language}`}</Typography>
                    </Box>
                    <Typography variant='body2'>{`Canadian work experience = ${chcFactor.canadian_work_experience}`}</Typography>
                    <Typography variant='body2' fontWeight={600} my={1}>{`Subtotal - Core/Human capital factors = ${chcFactor.subtotal}`}</Typography>
                </Box>


                <CRSTitle title="Spouse factors" />
                <Box px={2} borderBottom={1} borderColor={"GrayText"}>
                    <Typography variant='body2'>{`Level of education = ${sFactor.level_of_education}`}</Typography>
                    <Typography variant='body2'>{`First Official Languages = ${sFactor.first_official_language}`}</Typography>
                    <Typography variant='body2'>{`Canadian work experience = ${sFactor.canadian_work_experience}`}</Typography>
                    <Typography variant='body2' fontWeight={600} my={1}>{`Subtotal - Spouse factors = ${sFactor.subtotal}`}</Typography>
                </Box>



                <CRSTitle title="Skill transferability factors" />

                <Box px={2}>
                    <Typography variant='body1' fontWeight={600}>Education (to a maximum of 50 points)</Typography>
                    <Typography variant='body2'>{`A) Official Language proficiency and education = ${stFactor.education.official_language_proficiencey_and_education}`}</Typography>
                    <Typography variant='body2'>{`B) Canadian work experience and education = ${stFactor.education.canadian_work_experience_and_education}`}</Typography>
                    <Typography variant='body2' fontStyle={"italic"} my={1}>{`Subtotal = ${stFactor.education.subtotal}`}</Typography>
                </Box>

                <Box px={2} borderBottom={1} borderColor={"GrayText"}>
                    <Typography variant='body1' fontWeight={600}>Foreign work experience (to a maximum of 50 points)</Typography>
                    <Typography variant='body2'>{`A) Official Language proficiency and foreign work experience = ${stFactor.foreign_work_experience.official_language_proficiencey_and_foreign_work_experience}`}</Typography>
                    <Typography variant='body2'>{`B) Canadian and foreignwork experience = ${stFactor.foreign_work_experience.canadian_and_foreign_work_experience}`}</Typography>
                    <Typography variant='body2' fontStyle={"italic"} my={1} >{`Subtotal = ${stFactor.foreign_work_experience.subtotal}`}</Typography>

                    <Typography variant='body2' my={1}>{`Certificate of qualification = ${stFactor.certificate_of_qualification}`}</Typography>
                    <Typography variant='body2' fontWeight={600} my={1}>{`Subtotal Skill transferability factors = ${stFactor.subtotal}`}</Typography>

                </Box>


                <CRSTitle title="Additional points (to a maximum of 600 points)" />
                <Box px={2} borderBottom={1} borderColor={"GrayText"}>
                    <Typography variant='body2'>{`Provincial nomination = ${adPoints.provinicial_nomination}`}</Typography>
                    <Typography variant='body2'>{`Job offer = ${adPoints.job_offer}`}</Typography>
                    <Typography variant='body2'>{`Study in Canada = ${adPoints.study_in_canada}`}</Typography>
                    <Typography variant='body2'>{`Sibling in Canada = ${adPoints.sibling_in_canada}`}</Typography>
                    <Typography variant='body2'>{`French-language skills = ${adPoints.french_language_skills}`}</Typography>
                    <Typography variant='body2' fontWeight={600} my={1}>{`Subtotal Additional points = ${adPoints.subtotal}`}</Typography>
                </Box>

                <Typography variant='body1' fontWeight={600} my={1}>{`Total ( Core/Human capital factors + Spouse factors + Skill transferability factors )  = ${totalPoints}`}</Typography>
                <Typography variant='body1' fontWeight={600} my={1}>{`Comprehensive Ranking System formula grand total = ${crsGrandPointsTotal}`}</Typography>
            </MuiStandardCard>

            {oinpPoints && (
                <MuiStandardCard title='OINP Point Calculations' divider sx={{ mt: 2 }} >
                    <Box px={2} borderBottom={1} borderColor={"GrayText"}>
                        <Typography variant='body2'>{`NOC Category = ${oinpPoints.job_offer_points.noc_category}`}</Typography>
                        <Typography variant='body2'>{`TEER Category = ${oinpPoints.job_offer_points.teer_category}`}</Typography>
                        <Typography variant='body2'>{`wage = ${oinpPoints.job_offer_points.wage || 0}`}</Typography>
                        <Typography variant='body2'>{`Work Permit Status = ${oinpPoints.job_offer_points.work_permit_status || 0}`}</Typography>
                        <Typography variant='body2'>{`JOB Tenure = ${oinpPoints.job_offer_points.job_tenure || 0}`}</Typography>
                        <Typography variant='body2'>{`Earnings History = ${oinpPoints.job_offer_points.earnings_history || 0}`}</Typography>
                        <Typography variant='body2'>{`Location = ${oinpPoints.job_offer_points.location || 0}`}</Typography>
                        <Typography variant='body2' fontWeight={600} my={1}>{`Subtotal = ${oinpPoints.job_offer_points.oinp_subtotal}`}</Typography>
                    </Box>

                    <Typography variant='body1' fontWeight={600} my={1}>{`Total  = ${oinpPoints.oinp_total}`}</Typography>
                </MuiStandardCard>
            )}
        </DashboardContent>
    )
}
