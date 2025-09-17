import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { EducationProfileTable } from 'src/mui-components/EducationProfile/EducationProfileTable'
import { IPrivateLead, useAppDispatch } from 'src/redux'
import { upsertSinglePublicLeadWithCallbackAsync } from 'src/redux/child-reducers/leads/public-leads/public-leads.actions'

interface IEducationProfileStepProps {
    isFirstStep: boolean,
    isLastStep: boolean
    leadInfo: IPrivateLead,
    onSaveSuccess: (lead: IPrivateLead) => void,
    onBackClick: () => void
    onNextClick: () => void
}

export const EducationProfileStep: React.FC<IEducationProfileStepProps> = ({
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
                <EducationProfileTable
                    title="Applicant Education Deatils"
                    data={values.education}
                    onChange={(edu) => setFieldValue("education", edu)}
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
