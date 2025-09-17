import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { WorkHistoryProfileTable } from 'src/mui-components/WorkHistoryProfile/WorkHistoryProfileTable'
import { IPrivateLead, useAppDispatch } from 'src/redux'
import { upsertSinglePublicLeadWithCallbackAsync } from 'src/redux/child-reducers/leads/public-leads/public-leads.actions'

interface IWorkProfileStepProps {
    isFirstStep: boolean,
    isLastStep: boolean
    leadInfo: IPrivateLead,
    onSaveSuccess: (lead: IPrivateLead) => void,
    onBackClick: () => void
    onNextClick: () => void
}

export const WorkProfileStep: React.FC<IWorkProfileStepProps> = ({
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
