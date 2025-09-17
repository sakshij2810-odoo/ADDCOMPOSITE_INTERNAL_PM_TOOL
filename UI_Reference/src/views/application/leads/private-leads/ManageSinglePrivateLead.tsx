import { Box, Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { DashboardContent } from 'src/layouts/dashboard'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { clearPrivateLeadsFullStateSync, fetchSinglePrivateLeadWithArgsAsync, getLanguageOptions, getLanguageProficiencyOptions, IStoreState, regenerateSingleLeadReportAISummaryWithCallbackAsync, upsertSinglePrivateLeadWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'
import { LoadingButton } from '@mui/lab'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { EducationProfileView, JobOfferProfileTable } from 'src/mui-components'
import { useParams, useRouter } from 'src/routes/hooks'
import { LanguageAbilityTitle } from './components'
import { ILoadState } from 'src/redux/store.enums'
import { main_app_routes } from 'src/routes/paths'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import { useSearchParamsV2 } from 'src/routes/hooks/use-search-params'
import { TravelHistoryProfileTable } from 'src/mui-components/TravelHistoryProfile/TravelHistoryProfileTable'
import { EducationProfileTable } from 'src/mui-components/EducationProfile/EducationProfileTable'
import { WorkHistoryProfileTable } from 'src/mui-components/WorkHistoryProfile/WorkHistoryProfileTable'
import { CUSTOMER_STATUS_IN_COUNTRY_LIST } from 'src/redux/child-reducers/customers/customers.constants'
import { ServiceSubTypeDropdown, ServiceTypeDropdown } from '../../management/services'
import { StatesDropdown } from '../../management/services/dropdowns/StatesDropdown'
import { UserAutoSearchMultiSelect, UserBranchAutoSearch } from '../../management/user-profiles'
import { isArray } from 'lodash'
import { useAuthContext } from 'src/auth/hooks'
import { ChildrenProfileTable } from 'src/mui-components/ChildrenProfile'
import { COUNTRY_CODE_LIST } from 'src/constants/country-with-codes'
import { AVAILABLE_FUNDS_LIST } from './Leads.contants'
import { LeadTermsDialog } from './dialogs'
import { JOB_OFFER_EARNING_HISTORY, JOB_OFFER_JOB_TENURE, JOB_OFFER_LOCATION, JOB_OFFER_NOC_CATEGORIES, JOB_OFFER_TEER_CATEGORIES, JOB_OFFER_WAGE_LIST, JOB_OFFER_WORK_PERMIT_STATUS } from 'src/mui-components/JobOfferProfile/constants'

export function isValidEmail(email: string): boolean {
    if (!email) return false;

    // Basic RFC 5322 compliant pattern (covers most valid cases)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

interface IManageSinglePrivateLeadProps {
    fullView?: boolean
}

const ManageSinglePrivateLead: React.FC<IManageSinglePrivateLeadProps> = ({ fullView }) => {
    const { uuid } = useParams() as { uuid?: string };
    // const {referral_code} = useParams() as { referral_code?: string };
    const { user: loginedUser, user_fullname } = useAuthContext()

    // console.log("referral_code", referral_code)
    // const pCountry = useSearchParamsV2("country")
    // const pState = useSearchParamsV2("state")
    // const pServiceType = useSearchParamsV2("service_type")
    const referralCode = useSearchParamsV2("referral_code")

    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        data: singleleadInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.leads.single_private_lead);

    const [filesToUplaod, setfilesToUplaod] = useState<{
        passport: File | null,
        wes_document: File | null,
        iltes_document: File | null,
        resume: File | null,
    }>({ passport: null, wes_document: null, iltes_document: null, resume: null })

    const [openTermDialog, setopenTermDialog] = useState(false)

    const {
        values,
        errors,
        isSubmitting,
        setSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: singleleadInfo,
        validate: values => {
            let errors: any = {}
            if (!values.applicant_first_name) {
                errors.applicant_first_name = "*This is required field"
            }
            if (!values.applicant_last_name) {
                errors.applicant_last_name = "*This is required field"
            }

            // if (!values.state_or_province) {
            //     errors.state_or_province = "*This is required field"
            // }
            // if (!values.service_sub_type) {
            //     errors.service_sub_type = "*This is required field"
            // }
            // if (!values.service_type) {
            //     errors.service_type = "*This is required field"
            // }
            if (!values.applicant_date_of_birth) {
                errors.applicant_date_of_birth = "*This is required field"
            }
            if (!values.applicant_sex) {
                errors.applicant_sex = "*This is required field"
            }
            if (!values.marital_status) {
                errors.marital_status = "*This is required field"
            }
            if (!values.contact_number && !values.country_code) {
                errors.contact_number = "*This is required field"
            }
            if (!values.country_code) {
                errors.contact_number = "*Country Code is missing."
            }
            if (!values.contact_number) {
                errors.contact_number = "*Contact Number is missing."
            }

            if (!values.email) {
                errors.email = "*This is required field"
            } else if (isValidEmail(values.email) === false) {
                errors.email = "*Invalid email address."
            }
            if (values.marital_status === "MARRIED" || values.marital_status === "COMMON_LAW") {
                if (!values.spouse_first_name) {
                    errors.spouse_first_name = "*This is required field"
                }
                if (!values.spouse_last_name) {
                    errors.spouse_last_name = "*This is required field"
                }
                if (!values.spouse_date_of_birth) {
                    errors.spouse_date_of_birth = "*This is required field"
                }
                if (!values.spouse_sex) {
                    errors.spouse_sex = "*This is required field"
                }
                if (!values.terms_and_condition) {
                    errors.terms_and_condition = "*This is required field"
                }
            }
            // if (!isArray(values.asignee) || values.asignee.length <= 0) {
            //     errors.asignee = "*This is required field"
            // }
            if (!values.leads_source) {
                errors.leads_source = "*This is required field"
            }
            if (["REFERED_BY", "OTHER"].includes(values.leads_source as string) && !values.specify) {
                errors.specify = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            dispatch(upsertSinglePrivateLeadWithCallbackAsync({
                payload: { ...values, net_worth: Number(values.movable) + Number(values.immovable) },
                documents: filesToUplaod,
                onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        dispatch(regenerateSingleLeadReportAISummaryWithCallbackAsync({
                            payload: {
                                leads_uuid: data.leads_uuid as string
                            },
                            onSuccess(isSuccess, data) {
                            },
                        }))
                        router.push(`${main_app_routes.app.leads.root}/manage/${data.leads_uuid}/${data.service_type}?tab=CRS_POINTS`)
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });


    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSinglePrivateLeadWithArgsAsync({ uuid }))
    }, [uuid])


    useEffect(() => {
        let newVals = { ...singleleadInfo }
        if (!singleleadInfo.leads_uuid) {
            newVals.branch_uuid = loginedUser.branch_uuid,
                newVals.branch_name = loginedUser.branch_name
            // newVals.asignee = [
            //     {
            //         asignee_uuid: loginedUser.user_uuid,
            //         asignee_name: user_fullname,
            //         asignee_email: loginedUser.email
            //     }
            // ]
            // if (pCountry) {
            //     newVals.country = pCountry
            // }
            // if (pState) {
            //     newVals.state_or_province = pState
            // }
            // if (pServiceType) {
            //     newVals.service_type = pServiceType
            // }
            if (referralCode) {
                newVals.referral_code = referralCode as string
            }
        }
        setValues(newVals);
    }, [singleleadInfo]);


    useEffect(() => {
        return () => {
            dispatch(clearPrivateLeadsFullStateSync())
        }
    }, [])

    const applicantEnglishAbiltyProperties = (
        <MuiStandardCard title='Language Ability Details' divider sx={{ mt: 2 }} >
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                    <LanguageAbilityTitle title="Applicant First Official Language Ability" />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiSelect
                        name="english_test_result_less_than_two_years" label="Are your test results less than two years old?"
                        value={values.english_test_result_less_than_two_years}
                        onChange={handleChange}
                        error={errors.english_test_result_less_than_two_years}
                        options={["YES", "NO"].map((option) => ({ label: option, value: option }))}
                    />
                </Grid>
                {Boolean(values.english_test_result_less_than_two_years === "YES") && <>
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="english_language_test_type" label="Choose first official language?"
                            placeholder='Employement Type'
                            value={values.english_language_test_type}
                            onChange={(evt) => setValues((prev) => ({
                                ...prev,
                                english_language_test_type: evt.target.value as "IELTS",
                                english_ability_speaking: null,
                                english_ability_listening: null,
                                english_ability_reading: null,
                                english_ability_writing: null,
                                french_language_test_type: null,
                                french_ability_speaking: null,
                                french_ability_listening: null,
                                french_ability_reading: null,
                                french_ability_writing: null,

                            }))}
                            error={errors.english_language_test_type}
                            options={getLanguageOptions()}
                            disabled={!values.english_test_result_less_than_two_years}
                        />
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="english_ability_speaking" label="Speaking" disabled={!values.english_language_test_type}
                            value={values.english_ability_speaking} onChange={handleChange} error={errors.english_ability_speaking}
                            options={getLanguageProficiencyOptions(values.english_language_test_type as "IELTS", "SPEAKING")}
                        />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="english_ability_listening" label="Listening" disabled={!values.english_language_test_type}
                            value={values.english_ability_listening} onChange={handleChange} error={errors.english_ability_listening}
                            options={getLanguageProficiencyOptions(values.english_language_test_type as "IELTS", "LISTENING")}
                        />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="english_ability_reading" label="Reading" disabled={!values.english_language_test_type}
                            value={values.english_ability_reading} onChange={handleChange} error={errors.english_ability_reading}
                            options={getLanguageProficiencyOptions(values.english_language_test_type as "IELTS", "READING")}
                        />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="english_ability_writing" label="Writing" disabled={!values.english_language_test_type}
                            value={values.english_ability_writing} onChange={handleChange} error={errors.english_ability_writing}
                            options={getLanguageProficiencyOptions(values.english_language_test_type as "IELTS", "WRITING")}
                        />
                    </Grid>
                </>}


                <Grid item xs={12} md={12} lg={12}>
                    <LanguageAbilityTitle title="Second Official Language Ability" />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiSelect
                        name="french_test_result_less_than_two_years" label="Are your test results less than two years old?"
                        value={values.french_test_result_less_than_two_years}
                        onChange={handleChange}
                        error={errors.french_test_result_less_than_two_years}
                        options={["YES", "NO"].map((option) => ({ label: option, value: option }))}
                    />
                </Grid>
                {Boolean(values.french_test_result_less_than_two_years == "YES") &&
                    <>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="french_language_test_type" label="Choose second official language?"
                                placeholder='Test Type'
                                value={values.french_language_test_type}
                                onChange={(evt) => setValues((prev) => ({
                                    ...prev,
                                    french_language_test_type: evt.target.value as "IELTS",
                                    french_ability_speaking: null,
                                    french_ability_listening: null,
                                    french_ability_reading: null,
                                    french_ability_writing: null,

                                }))}
                                error={errors.french_language_test_type}
                                options={getLanguageOptions(values.english_language_test_type as "IELTS")}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="french_ability_speaking" label="Speaking" disabled={!values.french_language_test_type}
                                value={values.french_ability_speaking} onChange={handleChange} error={errors.french_ability_speaking}
                                options={getLanguageProficiencyOptions(values.french_language_test_type as "IELTS", "SPEAKING")}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="french_ability_listening" label="Listening" disabled={!values.french_language_test_type}
                                value={values.french_ability_listening} onChange={handleChange} error={errors.french_ability_listening}
                                options={getLanguageProficiencyOptions(values.french_language_test_type as "IELTS", "LISTENING")}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="french_ability_reading" label="Reading" disabled={!values.french_language_test_type}
                                value={values.french_ability_reading} onChange={handleChange} error={errors.french_ability_reading}
                                options={getLanguageProficiencyOptions(values.french_language_test_type as "IELTS", "READING")}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="french_ability_writing" label="Writing" disabled={!values.french_language_test_type}
                                value={values.french_ability_writing} onChange={handleChange} error={errors.french_ability_writing}
                                options={getLanguageProficiencyOptions(values.french_language_test_type as "IELTS", "WRITING")}
                            />
                        </Grid>
                    </>
                }
            </Grid>
        </MuiStandardCard>
    )


    const spouseEnglishAbiltyProperties = (
        <MuiStandardCard title='Spouse Language Ability Details' divider sx={{ mt: 2 }} >
            <Grid container spacing={2}>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiSelect
                        name="spouse_english_test_result_less_than_two_years" label="Are your test results less than two years old?"
                        value={values.spouse_english_test_result_less_than_two_years}
                        onChange={handleChange}
                        error={errors.spouse_english_test_result_less_than_two_years}
                        options={["YES", "NO"].map((option) => ({ label: option, value: option }))}
                    />
                </Grid>
                {Boolean(values.spouse_english_test_result_less_than_two_years === "YES") && <>
                    <Grid component="span" item xs={12} />
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="spouse_english_language_test_type" label="Test Type"
                            placeholder='Employement Type'
                            value={values.spouse_english_language_test_type}
                            onChange={(evt) => setValues((prev) => ({
                                ...prev,
                                spouse_english_language_test_type: evt.target.value as "IELTS",
                                spouse_english_ability_speaking: null,
                                spouse_english_ability_listening: null,
                                spouse_english_ability_reading: null,
                                spouse_english_ability_writing: null,


                            }))}
                            error={errors.spouse_english_language_test_type}
                            options={getLanguageOptions()}
                            disabled={!values.spouse_english_test_result_less_than_two_years}
                        />
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="spouse_english_ability_speaking" label="Speaking" disabled={!values.spouse_english_language_test_type}
                            value={values.spouse_english_ability_speaking} onChange={handleChange} error={errors.spouse_english_ability_speaking}
                            options={getLanguageProficiencyOptions(values.spouse_english_language_test_type as "IELTS", "SPEAKING")}
                        />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="spouse_english_ability_listening" label="Listening" disabled={!values.spouse_english_language_test_type}
                            value={values.spouse_english_ability_listening} onChange={handleChange} error={errors.spouse_english_ability_listening}
                            options={getLanguageProficiencyOptions(values.spouse_english_language_test_type as "IELTS", "LISTENING")}
                        />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="spouse_english_ability_reading" label="Reading" disabled={!values.spouse_english_language_test_type}
                            value={values.spouse_english_ability_reading} onChange={handleChange} error={errors.spouse_english_ability_reading}
                            options={getLanguageProficiencyOptions(values.spouse_english_language_test_type as "IELTS", "READING")}
                        />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <MuiFormFields.MuiSelect
                            name="spouse_english_ability_writing" label="Writing" disabled={!values.spouse_english_language_test_type}
                            value={values.spouse_english_ability_writing} onChange={handleChange} error={errors.spouse_english_ability_writing}
                            options={getLanguageProficiencyOptions(values.spouse_english_language_test_type as "IELTS", "WRITING")}
                        />
                    </Grid>
                </>}
            </Grid>
        </MuiStandardCard>
    )


    const otherProperties = (
        <MuiStandardCard title='Other Details' divider sx={{ mt: 2 }}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='subtitle2' mb={1}>Do you have a certificate of qualification from a Canadian province, territory or federal body?</Typography>
                    <MuiFormFields.MuiSelect
                        sx={{ maxWidth: 250 }}
                        name="certificate_of_qualification"
                        placeholder='Enter Certificate of Qualification'
                        options={[
                            { label: "Yes", value: "YES" },
                            { label: "No", value: "NO" },
                        ]}
                        value={values.certificate_of_qualification}
                        onChange={(evt) => {
                            console.log("Mui Input Change => ", evt.target)
                            handleChange(evt)
                        }}
                    />
                </Grid>

                <Grid item xs={12} mt={2}> <Typography variant='h6'>Additional Points</Typography></Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='subtitle2' mb={1}>Do you have a valid job offer supported by a Labour Market Impact Assessment (if needed)?</Typography>
                    <MuiFormFields.MuiSelect
                        sx={{ maxWidth: 250 }}
                        name="is_valid_job_offer"
                        options={[
                            { label: "Yes", value: "YES" },
                            { label: "No", value: "NO" },
                        ]}
                        value={values.is_valid_job_offer}
                        onChange={(evt) => {
                            setValues((prev) => ({
                                ...prev,
                                is_valid_job_offer: evt.target.value as "YES",
                                ...(evt.target.value === "NO" && {
                                    is_valid_job_offer: evt.target.value as "NO",
                                    teer_category: null,
                                    noc_category: null,
                                    wage: null,
                                    work_permit_status: null,
                                    job_tenure: null,
                                    earnings_history: null,
                                    location: null,
                                })
                            }))
                        }}
                    />
                </Grid>
                {values.is_valid_job_offer === "YES" && (
                    <>
                        {/* <Grid item xs={12} md={12} lg={12}>
                        <Typography variant='subtitle2' mb={1}>Which NOC TEER is the job offer?</Typography>
                        <MuiFormFields.MuiSelect
                            sx={{ maxWidth: 250 }}
                            name="noc_teer_job_offer_type"
                            options={[
                                { label: "NOC TEER 0 Major group 00", value: "NOC_TEER_0" },
                                { label: "NOC TEER 1, 2 or 3, or any TEER 0 other than Major group 00", value: "NOC_TEER_123" },
                                { label: "NOC TEER 4 or 5", value: "NOC_TEER_45" },
                            ]}

                            value={values.noc_teer_job_offer_type}
                            onChange={handleChange}
                        />
                    </Grid> */}
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="noc_category" label="NOC Job Category"
                                placeholder='NOC Category'
                                value={values.noc_category}
                                onChange={handleChange}
                                error={errors.noc_category}
                                options={JOB_OFFER_NOC_CATEGORIES}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="teer_category" label="TEER Category"
                                placeholder='TEER Category'
                                value={values.teer_category}
                                onChange={handleChange}
                                error={errors.teer_category}
                                options={JOB_OFFER_TEER_CATEGORIES}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="wage" label="Wage"
                                placeholder='Wage'
                                value={values.wage}
                                onChange={handleChange}
                                error={errors.wage}
                                options={JOB_OFFER_WAGE_LIST}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="work_permit_status" label="Work Permit Status"
                                placeholder='Work Permit Status'
                                value={values.work_permit_status}
                                onChange={handleChange}
                                error={errors.work_permit_status}
                                options={JOB_OFFER_WORK_PERMIT_STATUS}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="job_tenure" label="Job Tenure"
                                placeholder='Job Tenure'
                                value={values.job_tenure}
                                onChange={handleChange}
                                error={errors.job_tenure}
                                options={JOB_OFFER_JOB_TENURE}
                            />
                        </Grid>

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="earnings_history" label="Earning history"
                                placeholder='Earning history'
                                value={values.earnings_history}
                                onChange={handleChange}
                                error={errors.earnings_history}
                                options={JOB_OFFER_EARNING_HISTORY}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="location" label="Location"
                                placeholder='Location'
                                value={values.location}
                                onChange={handleChange}
                                error={errors.location}
                                options={JOB_OFFER_LOCATION}
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='subtitle2' mb={1}>Do you have a nomination certificate from a province or territory?</Typography>
                    <MuiFormFields.MuiSelect
                        sx={{ maxWidth: 250 }}
                        name="province_or_territory_nomination"
                        options={[
                            { label: "Yes", value: "YES" },
                            { label: "No", value: "NO" },
                        ]}
                        value={values.province_or_territory_nomination}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='subtitle2' mb={1}>Do you or your spouse have at least one Brother or sister living in canada who is a citizen or permanent resident of canada?</Typography>
                    <Grid container>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                sx={{ maxWidth: 250 }}
                                name="relatives_in_canada"
                                options={[
                                    { label: "Yes", value: "YES" },
                                    { label: "No", value: "NO" },
                                ]}
                                value={values.relatives_in_canada}
                                onChange={handleChange}
                            />
                        </Grid>
                        {values.relatives_in_canada === "YES" &&
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiSelect
                                    sx={{ maxWidth: 250 }}
                                    label='Relation with relative'
                                    name="relative_relation"
                                    options={[
                                        { label: "Brother", value: "BROTHER" },
                                        { label: "Sister", value: "SISTER" },
                                        { label: "Mother", value: "MOTHER" },
                                        { label: "Father", value: "FATHER" },
                                        { label: "Friend", value: "FRIEND" },
                                        { label: "Aunt", value: "AUNT" },
                                        { label: "Uncle", value: "UNCLE" },
                                        { label: "Grand Mother", value: "GRAND_MOTHER" },
                                        { label: "Grand Father", value: "GRAND_FATHER" },
                                    ]}
                                    value={values.relative_relation}
                                    onChange={handleChange}
                                />
                            </Grid>
                        }
                    </Grid>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='subtitle2' mb={1}>Do you have prior travel history?</Typography>
                    <MuiFormFields.MuiSelect
                        sx={{ maxWidth: 250 }}
                        name="prior_travel_history"
                        options={[
                            { label: "Yes", value: "YES" },
                            { label: "No", value: "NO" },
                        ]}
                        value={values.prior_travel_history}
                        onChange={handleChange}
                    />
                </Grid>

                {values.prior_travel_history === "YES" &&
                    <Grid item xs={12} md={12} lg={12}>
                        <TravelHistoryProfileTable
                            module="LEAD"
                            title="Applicant Travel History"
                            data={values.travel_history}
                            onChange={(travel) => setFieldValue("travel_history", travel)}
                        />
                    </Grid>
                }
                <Grid item xs={12} md={12} lg={12}>
                    <Typography variant='subtitle2' mb={1}>Funds Available</Typography>
                    <MuiFormFields.MuiSelect
                        sx={{ maxWidth: 250 }}
                        name="funds_available"

                        options={AVAILABLE_FUNDS_LIST}
                        value={values.funds_available}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiCheckBox
                        label="Terms & Conditions"
                        name="terms_and_condition"
                        sx={{ pl: "2px" }}
                        checked={!!values.terms_and_condition}
                        onChange={(evt, cheked) => {
                            if (cheked) {
                                setopenTermDialog(true)
                            } else {
                                setFieldValue("terms_and_condition", 0)
                            }
                            // setFieldValue("terms_and_condition", Number(cheked))
                        }}
                        error={errors.terms_and_condition}
                    />
                </Grid>

            </Grid>
        </MuiStandardCard>
    )


    return (
        <DashboardContent metaTitle='Lead Information' disablePadding={!fullView} loading={ILoadState.pending === loading}
            sx={{ position: 'relative' }}>

            {fullView && <CustomBreadcrumbs
                heading={`${uuid ? "Update" : "Create"} New Lead`}
                links={[
                    { name: 'Leads', href: main_app_routes.app.leads.root },
                    { name: `${uuid ? "Update" : "Create"} New Lead` },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />}

            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='Applicant Details' divider>
                    <Grid container spacing={2}>


                        {/* <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="country" label="Country"
                                value={values.country} onChange={(evt, newCountry) => setFieldValue("country", newCountry)}
                                error={errors.country}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <StatesDropdown
                                name='state_or_province'
                                label='State or province' country={values.country} disabled={!values.country}
                                value={values.state_or_province} onChange={handleChange}
                                error={errors.state_or_province}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <ServiceTypeDropdown
                                name='service_type'
                                label='Service Type' country={values.country || ''} state={values.state_or_province || ""}
                                disabled={!values.country || !values.state_or_province}
                                value={values.service_type} onChange={handleChange}
                                error={errors.service_type}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <ServiceSubTypeDropdown
                                name='service_sub_type'
                                label='Service Sub Type'
                                country={values.country as string}
                                state={values.state_or_province}
                                serviceType={values.service_type || ''}
                                disabled={!values.country || !values.state_or_province || !values.service_type}
                                value={values.service_sub_type}
                                onChange={(sst) => setFieldValue("service_sub_type", sst.services_sub_type)}
                                error={errors.service_sub_type}
                            />
                        </Grid> */}
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="applicant_first_name" label="Applicant First Name" value={values.applicant_first_name}
                                onChange={handleChange} error={errors.applicant_first_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="applicant_last_name" label="Applicant Last Name" value={values.applicant_last_name}
                                onChange={handleChange} error={errors.applicant_last_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="email" label="Applicant Email" value={values.email}
                                onChange={handleChange} error={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiPhoneNumberFieldV2
                                name="contact_number" label="Contact Number"
                                countryCode={values.country_code} value={values.contact_number}
                                onCountryCodeChange={(code) => setFieldValue("country_code", code)}
                                onChange={handleChange} error={errors.contact_number}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePickerV2
                                // name="applicant_date_of_birth"
                                label="Applicant DOB"
                                value={values.applicant_date_of_birth} onChange={(value) => setFieldValue("applicant_date_of_birth", value)} error={errors.applicant_date_of_birth}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="nationality" label="Nationality"
                                value={values.nationality}
                                onChange={(evt, newCountry) => setFieldValue("nationality", newCountry)}
                                error={errors.nationality}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="country_of_residence" label="Country Of Residence ( if different then nationality )"
                                value={values.country_of_residence}
                                onChange={(evt, newCountry) => setFieldValue("country_of_residence", newCountry)}
                                error={errors.country_of_residence}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="status_in_country"
                                label="Status in Country" disabled={!values.country_of_residence}
                                options={CUSTOMER_STATUS_IN_COUNTRY_LIST}
                                value={values.status_in_country} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="subtitle2">Applicant Sex</Typography>
                            <MuiFormFields.MuiRadioGroup
                                row
                                name="applicant_sex"
                                options={[
                                    { label: "Male", value: "MALE" },
                                    { label: "Female", value: "FEMALE" },
                                    { label: "Unknown", value: "OTHERS" },
                                ]}
                                value={values.applicant_sex}
                                onChange={handleChange}
                                error={errors.applicant_sex}
                                sx={{ pl: "2px" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="subtitle2">Marital Status</Typography>
                            <MuiFormFields.MuiRadioGroup
                                // label='Marital Status'
                                row
                                name="marital_status"
                                options={[
                                    { label: "Annulled Marriage", value: "ANNULLED MARRIAGE" },
                                    { label: "Common-Law", value: "COMMON_LAW" },
                                    { label: "Divorced / Separated", value: "DIVORCED_OR_SEPARATED" },
                                    { label: "Legally Separated", value: "LEGALLY_SEPARATED" },
                                    { label: "Married", value: "MARRIED" },
                                    { label: "Never Married / Single", value: "NEVER_MARRIED_OR_SINGLE" },
                                    { label: "Widowed", value: "WIDOWED" },
                                ]}
                                value={values.marital_status}
                                onChange={handleChange}
                                error={errors.marital_status}
                            />
                        </Grid>

                        {/* {values.marital_status !== "NEVER_MARRIED_OR_SINGLE" && <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="number_of_children" label="Number of Children"
                                value={values.number_of_children} onChange={handleChange} error={errors.number_of_children}
                            />
                        </Grid>} */}

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="leads_source" label="Leads Source"
                                options={[
                                    { label: "Google", value: "GOOGLE" },
                                    { label: "Facebook", value: "FACEBOOK" },
                                    { label: "Referred By", value: "REFERRED_BY" },
                                    { label: "Other", value: "OTHER" },
                                ]}
                                value={values.leads_source} onChange={handleChange}
                                error={errors.leads_source}
                            />

                        </Grid>
                        {["REFERED_BY", "OTHER"].includes(values.leads_source as string) && <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="specify" label="Specify"
                                value={values.specify} onChange={handleChange} error={errors.specify}
                            />
                        </Grid>}
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="time_to_contact" label="Time To Contact"
                                options={[
                                    { label: "9:00 am to 12:00pm", value: "9:00 am to 12:00pm" },
                                    { label: "12:00pm to 3:00pm", value: "12:00pm to 3:00pm" },
                                    { label: "3:00pm to 6:00pm", value: "3:00pm to 6:00pm" },
                                ]}
                                value={values.time_to_contact} onChange={handleChange}
                                error={errors.time_to_contact}
                            />
                        </Grid>
                        {values.service_type === "VISITOR" && <>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiSelect
                                    name="sponsor_type" label="Sponsor Type"
                                    value={values.sponsor_type}
                                    error={errors.sponsor_type}
                                    options={[
                                        { label: "Parents", value: "Parents" },
                                        { label: "Grandparents", value: "Grandparents" },
                                        { label: "Son", value: "Son" },
                                        { label: "Daughter", value: "Daughter" },
                                        { label: "Brother", value: "Brother" },
                                        { label: "Sister", value: "Sister" },
                                        { label: "Relatives", value: "Relatives" },
                                        { label: "Friends", value: "Friends" },
                                        { label: "Business", value: "Business" },
                                    ]}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="sponsor_income" label="Sponsor Income"
                                    value={values.sponsor_income} onChange={handleChange} error={errors.sponsor_income}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="currency_field" label="Currency"
                                    value={values.currency_field} onChange={handleChange} error={errors.currency_field}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="movable" label="Movable"
                                    value={values.movable} onChange={handleChange} error={errors.movable}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="immovable" label="Immovable"
                                    value={values.immovable} onChange={handleChange} error={errors.immovable}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="net_worth" label="Net Worth" disabled={true}
                                    value={Number(values.movable || 0) + Number(values.immovable || 0)}
                                    onChange={handleChange} error={errors.net_worth}
                                />
                            </Grid>
                        </>
                        }

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="referral_code" label="Referral Code" disabled
                                value={values.referral_code}
                                onChange={handleChange} error={errors.referral_code}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>


                {values.marital_status !== "NEVER_MARRIED_OR_SINGLE" && (
                    <ChildrenProfileTable
                        title="Applicant Children's Details"
                        data={values.childrens_details || []}
                        onChange={(edu) => setFieldValue("childrens_details", edu)}
                    />
                )}

                <EducationProfileTable
                    title="Applicant Education Details"
                    data={values.education}
                    onChange={(edu) => setFieldValue("education", edu)}
                />


                {values.service_type !== "STUDY" && (
                    <WorkHistoryProfileTable
                        title={
                            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
                                <Typography component="span" fontSize="1.125rem" fontWeight={600}>Applicant Work History</Typography>
                                <MuiFormFields.MuiCheckBox
                                    label="Has No Work Experience"
                                    name="no_work_experience"
                                    sx={{ pl: "10px" }}
                                    checked={!!values.no_work_experience}
                                    onChange={(evt, cheked) => {
                                        setFieldValue("no_work_experience", Number(cheked));
                                        if (cheked) {
                                            setFieldValue("work_history", []);
                                        }
                                    }}
                                    error={errors.no_work_experience}
                                />
                            </Box>
                        }
                        hasWWorkExperience={Boolean(values.no_work_experience)}
                        data={values.work_history}
                        onChange={(edu) => setFieldValue("work_history", edu)}
                    />
                )}

                {/* <JobOfferProfileTable
                    title="Job Offer Details"
                    data={values?.job_offer || []}
                    onChange={(edu) => setFieldValue("job_offer", edu)}
                /> */}

                {applicantEnglishAbiltyProperties}

                {values.marital_status === "MARRIED" &&
                    <>
                        <MuiStandardCard title='Spouse Details' divider sx={{ mt: 2 }}>
                            <Grid container spacing={2}>

                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiTextField
                                        name="spouse_first_name" label="Spouse First Name"
                                        value={values.spouse_first_name} onChange={handleChange} error={errors.spouse_first_name}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiTextField
                                        name="spouse_last_name" label="Spouse Last Name"
                                        value={values.spouse_last_name} onChange={handleChange} error={errors.spouse_last_name}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiDatePickerV2
                                        label="Spouse DOB"
                                        value={values.spouse_date_of_birth} onChange={(value) => setFieldValue("spouse_date_of_birth", value)} error={errors.spouse_date_of_birth}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Typography variant="subtitle2">Spouse Sex</Typography>
                                    <MuiFormFields.MuiRadioGroup
                                        // label='Spouse Sex'
                                        row
                                        name="spouse_sex"
                                        options={[
                                            { label: "Male", value: "MALE" },
                                            { label: "Female", value: "FEMALE" },
                                            { label: "Others", value: "OTHERS" },
                                        ]}
                                        value={values.spouse_sex}
                                        onChange={handleChange}
                                        error={errors.spouse_sex}
                                        sx={{ pl: "2px" }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                </Grid>

                            </Grid>
                        </MuiStandardCard>

                        <EducationProfileTable title="Spouse Education Details"
                            data={values.spouse_education}
                            onChange={(spouse_edu) => setFieldValue("spouse_education", spouse_edu)}
                        />
                        {values.service_type !== "STUDY" && (
                            <WorkHistoryProfileTable
                                title={
                                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
                                        <Typography component="span" fontSize="1.125rem" fontWeight={600}>Spouse Work History</Typography>
                                        <MuiFormFields.MuiCheckBox
                                            label="Has No Work Experience"
                                            name="spouse_no_work_experience"
                                            sx={{ pl: "10px" }}
                                            checked={!!values.spouse_no_work_experience}
                                            onChange={(evt, cheked) => {
                                                setFieldValue("spouse_no_work_experience", Number(cheked));
                                                if (cheked) {
                                                    setFieldValue("spouse_work_history", []);
                                                }
                                            }}
                                            error={errors.spouse_no_work_experience}
                                        />
                                    </Box>
                                }
                                hasWWorkExperience={Boolean(values.spouse_no_work_experience)}
                                data={values.spouse_work_history}
                                onChange={(s_w_history) => setFieldValue("spouse_work_history", s_w_history)} />
                        )}

                        {spouseEnglishAbiltyProperties}

                    </>
                }

                {otherProperties}

                <Stack direction="row" sx={{
                    justifyContent: 'flex-end',
                    mt: 3, position: "sticky", right: 0, bottom: 8

                }}>
                    <Box sx={{
                        borderRadius: 1,
                        padding: 2,
                        background: (theme) => theme.palette.background.default,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: 'flex-start',
                        gap: 2,
                        flexWrap: "wrap"
                    }}>
                        <UserBranchAutoSearch
                            label="User Branch"
                            error={errors.branch_uuid}
                            value={{
                                branch_uuid: values.branch_uuid,
                                branch_name: values.branch_name,
                            }}
                            onSelect={(value) => {
                                setValues({
                                    ...values,
                                    branch_uuid: value.branch_uuid as string,
                                    branch_name: value.branch_name as string,
                                });
                            }}
                        />
                        <UserAutoSearchMultiSelect
                            label='Assignee'
                            role='EMPLOYEE'
                            value={values.asignee.map((asgn) => ({
                                user_uuid: asgn.asignee_uuid,
                                user_name: asgn.asignee_name,
                                user_email: asgn.asignee_email
                            }))}
                            onSelect={(users) => {
                                setValues({
                                    ...values,
                                    asignee: users.map((user) => ({
                                        asignee_uuid: user.user_uuid,
                                        asignee_name: user.user_name,
                                        asignee_email: user.user_email
                                    }))
                                })
                            }}
                            error={errors.asignee as any}
                        />
                        <LoadingButton type="submit" variant="contained"
                            loading={isSubmitting}
                        >
                            {'Save changes'}
                        </LoadingButton>
                    </Box>

                </Stack>

                {openTermDialog && (
                    <LeadTermsDialog
                        open={openTermDialog}
                        onClose={() => setopenTermDialog(false)}
                        onAccept={() => {
                            setFieldValue("terms_and_condition", 1)
                            setopenTermDialog(false)
                        }}
                    />
                )}
            </form>
        </DashboardContent>
    )
}

export default ManageSinglePrivateLead