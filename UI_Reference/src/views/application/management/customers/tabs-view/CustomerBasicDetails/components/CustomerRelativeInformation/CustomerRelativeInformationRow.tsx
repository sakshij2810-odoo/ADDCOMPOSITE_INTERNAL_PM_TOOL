import { Grid, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { ICustomerRelativeDetail } from 'src/redux/child-reducers'
import dayjs, { Dayjs } from 'dayjs'
import { Box } from '@mui/material'
import { IconButton } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { fDate } from 'src/utils/format-time'
import { cDate } from 'src/utils/format-date-time'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'

interface ICustomerRelativeInformationRowProps {
    data: ICustomerRelativeDetail
    onEditClick: () => void
    ondDeleteClick: () => void
}

export const CustomerRelativeInformationRow: React.FC<ICustomerRelativeInformationRowProps> = ({ data, onEditClick, ondDeleteClick }) => {
    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton onClick={onEditClick}><Iconify icon="solar:pen-bold" /></IconButton>
                    <IconButton color='error' onClick={ondDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                </TableCell>
                <TableCell>{data.relative_name}</TableCell>
                <TableCell>{data.relationship}</TableCell>
                <TableCell>{data.present_address}</TableCell>
            </TableRow>
        </>
    )
}
