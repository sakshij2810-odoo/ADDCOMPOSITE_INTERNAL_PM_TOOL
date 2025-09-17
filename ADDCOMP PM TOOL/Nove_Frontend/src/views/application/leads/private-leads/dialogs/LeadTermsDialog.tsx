import { Box, Grid, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultChildrenProfile, IChildrenProfile } from 'src/redux'
import { work_profile_employement_type_list, work_profile_loaction_type_list } from 'src/redux/child-reducers/leads/private-leads/private-leads.constants'

export function calculateAgeFromISO(isoDate: string): number {
    if (!isoDate) return 0; // handle empty/null case

    const birthDate = new Date(isoDate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

interface ILeadTermsDialogProps {
    open: boolean
    onClose: () => void;
    onAccept: () => void
}
export const LeadTermsDialog: React.FC<ILeadTermsDialogProps> = ({
    open, onClose, onAccept
}) => {


    return (
        <MuiStandardDialog
            open={open}
            onClose={onClose}
            title='Terms and Conditions'
            actions={[
                {
                    label: 'Cancel',
                    onClick: onClose
                },
                {
                    label: 'Accept',
                    variant: "contained",
                    onClick: onAccept
                }
            ]}
        >
            <Box sx={{ p: 2 }}>
                Terms and conditions content goes here. Please read carefully before accepting.
            </Box>
        </MuiStandardDialog >
    )
}
