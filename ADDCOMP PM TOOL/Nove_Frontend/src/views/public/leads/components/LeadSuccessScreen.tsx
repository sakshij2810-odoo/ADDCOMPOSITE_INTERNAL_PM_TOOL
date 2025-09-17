import { Box, Typography } from '@mui/material'
import React from 'react'

export const LeadSuccessScreen = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="h6" gutterBottom>
                Lead Created Successfuly!
            </Typography>
        </Box>
    )
}
