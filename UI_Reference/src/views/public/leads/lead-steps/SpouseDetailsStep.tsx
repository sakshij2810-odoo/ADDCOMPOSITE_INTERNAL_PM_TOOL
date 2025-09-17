import { LoadingButton } from '@mui/lab'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields, EducationProfileView } from 'src/mui-components'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { WorkHistoryProfileTable } from 'src/mui-components/WorkHistoryProfile/WorkHistoryProfileTable'
import { getLanguageOptions, getLanguageProficiencyOptions, IPrivateLead, useAppDispatch } from 'src/redux'
import { upsertSinglePublicLeadWithCallbackAsync } from 'src/redux/child-reducers/leads/public-leads/public-leads.actions'

interface ISpouseDetailsStepProps {
    isFirstStep: boolean,
    isLastStep: boolean
    leadInfo: IPrivateLead,
    onSaveSuccess: (lead: IPrivateLead) => void,
    onBackClick: () => void
    onNextClick: () => void
}

export const SpouseDetailsStep: React.FC<ISpouseDetailsStepProps> = ({
    isFirstStep, onBackClick, onNextClick, isLastStep, onSaveSuccess, leadInfo
}) => {
    const dispatch = useAppDispatch()

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
        initialValues: leadInfo,
        validate: values => {
            let errors: any = {}
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
            }
            return errors
        },
        onSubmit: (values) => {
            setSubmitting(true)
            dispatch(upsertSinglePublicLeadWithCallbackAsync({
                payload: { ...values }, documents: {}, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        onSaveSuccess(data)
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });


    useEffect(() => {
        setValues(leadInfo);
    }, [leadInfo]);



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

    return (
        <>
            <form onSubmit={handleSubmit}>
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

                    <EducationProfileView title="Spouse Education Deatils"
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
                <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1 }}>
                    <Button variant="outlined" disabled={isFirstStep}
                        onClick={onBackClick} sx={{ mr: 1 }}
                    >Back</Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}  >
                        {isLastStep ? 'Finish' : 'Next'}
                    </LoadingButton>

                </Stack>
            </form>

        </>
    )
}
