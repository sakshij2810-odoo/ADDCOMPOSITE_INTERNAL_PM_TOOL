import { LoadingButton } from '@mui/lab'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { getLanguageOptions, getLanguageProficiencyOptions, IPrivateLead, upsertSinglePublicLeadWithCallbackAsync, useAppDispatch } from 'src/redux'
import { LanguageAbilityTitle } from 'src/views/application/leads/private-leads/components'

interface ILanguageProfileStepProps {
    isFirstStep: boolean,
    isLastStep: boolean
    leadInfo: IPrivateLead,
    onSaveSuccess: (lead: IPrivateLead) => void,
    onBackClick: () => void
    onNextClick: () => void
}

export const LanguageProfileStep: React.FC<ILanguageProfileStepProps> = ({
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
    return (
        <>
            <form onSubmit={handleSubmit}>
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

                <Stack direction="row" sx={{
                    justifyContent: 'flex-end',
                    mt: 1

                }}>
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
