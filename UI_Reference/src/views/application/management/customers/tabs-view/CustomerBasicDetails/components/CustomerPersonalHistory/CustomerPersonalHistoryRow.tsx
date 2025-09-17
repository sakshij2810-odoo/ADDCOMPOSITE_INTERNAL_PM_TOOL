import { Grid, TableCell, TableRow, Typography } from '@mui/material'
import React from 'react'
import { ICustomerPersonalHistory } from 'src/redux/child-reducers'
import dayjs, { Dayjs } from 'dayjs'
import { Box } from '@mui/material'
import { IconButton } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { fDate } from 'src/utils/format-time'
import { cDate } from 'src/utils/format-date-time'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'

interface ICustomerPersonalHistoryRowProps {
    data: ICustomerPersonalHistory
    onEditClick: () => void
    ondDeleteClick: () => void
}

export const CustomerPersonalHistoryRow: React.FC<ICustomerPersonalHistoryRowProps> = ({ data, onEditClick, ondDeleteClick }) => {
    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton onClick={onEditClick}><Iconify icon="solar:pen-bold" /></IconButton>
                    <IconButton color='error' onClick={ondDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                </TableCell>
                <TableCell>{data.city_country}</TableCell>
                <TableCell>{data.status_in_country}</TableCell>
                <TableCell>{data.from_date}</TableCell>
                <TableCell>{data.to_date}</TableCell>
                <TableCell>{data.activity}</TableCell>
                <TableCell>{data.company_or_employer_name}</TableCell>

            </TableRow>
        </>
    )
}
