import { Tooltip } from '@mui/material'
import { IconButton } from '@mui/material'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { Iconify } from 'src/components/iconify'
import { RouterLink } from 'src/routes/components'

interface ILanguageAbilityTitleProps {
    title: string
}
export const LanguageAbilityTitle: React.FC<ILanguageAbilityTitleProps> = ({ title }) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            <Typography variant="h6" >{title}</Typography>
            <Tooltip title="View details">
                <IconButton component={RouterLink} target='_blank' href={"https://itcimmigration.com/en/language-charts"}>
                    <Iconify icon="eva:external-link-fill" />
                </IconButton>
            </Tooltip>
        </Box>
    )
}
