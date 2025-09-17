import { Grid, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { ICustomerFamilyInformation } from 'src/redux/child-reducers'
import dayjs, { Dayjs } from 'dayjs'
import { Box } from '@mui/material'
import { IconButton } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { fDate } from 'src/utils/format-time'
import { cDate } from 'src/utils/format-date-time'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'

interface IAdditionalFamilyInformationRowProps {
    data: ICustomerFamilyInformation
    onEditClick: () => void
    ondDeleteClick: () => void
}

export const AdditionalFamilyInformationRow: React.FC<IAdditionalFamilyInformationRowProps> = ({ data, onEditClick, ondDeleteClick }) => {
    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton onClick={onEditClick}><Iconify icon="solar:pen-bold" /></IconButton>
                    <IconButton color='error' onClick={ondDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                </TableCell>
                <TableCell>{data.relationship}</TableCell>
                <TableCell>{data.is_accompany_with_you}</TableCell>
                <TableCell>{data.member_first_name}</TableCell>
                <TableCell>{data.member_last_name}</TableCell>
                <TableCell>{cDate(data.member_dob)}</TableCell>
                <TableCell>{data.place_of_birth}</TableCell>
                <TableCell>{data.present_address}</TableCell>
            </TableRow>
        </>
    )
}
