import { AccordionDetails, AccordionProps, Box, Button, Divider, IconButton, Typography } from '@mui/material'
import { Accordion, AccordionSummary } from '@mui/material'
import React from 'react'
import { GridExpandMoreIcon } from '@mui/x-data-grid'

interface IMuiAccordionCardProps {
    defaultExpanded?: boolean
    expanded?: boolean
    divider?: boolean
    onToggle?: (open: boolean) => void
    title: string | React.ReactNode
    rightNode?: string | React.ReactNode
    children: React.ReactNode
    sx?: AccordionProps["sx"]
    disableShadow?: boolean,
    isExpandIconVisible?: boolean,
}

export const MuiAccordionStandardCard: React.FC<IMuiAccordionCardProps> = ({
    defaultExpanded, expanded, title, rightNode, children, divider, sx, disableShadow,
    onToggle, isExpandIconVisible = true
}) => {
    return (
        <Accordion defaultExpanded={defaultExpanded} expanded={expanded} sx={{
            ...sx,
            background: (theme) => theme.palette.background.paper,
            borderRadius: "16px !important",
            boxShadow: disableShadow ? "none" : "0 0 2px 0 rgba(145 158 171 / 0.2),0 12px 24px -4px rgba(145 158 171 / 0.12)",
            "&::before": {
                backgroundColor: "transparent"
            },
            "& .Mui-expanded": {
                // background: (theme) => theme.palette.mode === "dark" ? "#28323c" : "#f1f1f1",
                borderTopLeftRadius: "16px !important",
                borderTopRightRadius: "16px !important",
            }
        }}>
            <AccordionSummary
                expandIcon={isExpandIconVisible && <IconButton onClick={() => onToggle && onToggle(!expanded)}><GridExpandMoreIcon /></IconButton>}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ minHeight: 80 }}
            >
                <Box sx={{ width: "100%", pr: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                    {typeof title === "string" ? (
                        <Typography component="span" fontSize="1.125rem" fontWeight={600}>{title}</Typography>
                    ) : title}
                    {rightNode}
                </Box>
            </AccordionSummary>
            {divider && <Divider sx={{ mb: 2 }} />}
            <AccordionDetails sx={{
                // background: (theme) => theme.palette.mode === "dark" ? "#28323c" : "#f1f1f1",
                borderBottomLeftRadius: "16px !important",
                borderBottomRightRadius: "16px !important",
            }} >

                {children}
            </AccordionDetails>
        </Accordion>

    )
}



export const MuiAccordionStandardCardV2: React.FC<IMuiAccordionCardProps> = ({
    defaultExpanded, expanded, title, rightNode, children,
    onToggle
}) => {
    return (
        <Accordion defaultExpanded={defaultExpanded} expanded={expanded} sx={{
            background: (theme) => theme.palette.mode === "dark" ? "#28323c" : "#f1f1f1",
            borderRadius: "16px !important",
            boxShadow: "none !important",
            "& .Mui-expanded": {
                background: (theme) => theme.palette.mode === "dark" ? "#28323c" : "#f1f1f1",
                borderTopLeftRadius: "16px !important",
                borderTopRightRadius: "16px !important",
            }
        }}>
            <AccordionSummary
                expandIcon={<IconButton onClick={() => onToggle && onToggle(!expanded)}><GridExpandMoreIcon /></IconButton>}
                aria-controls="panel1-content"
                id="panel1-header"

            >
                <Box sx={{ width: "100%", pr: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                    <Typography variant="h4" fontWeight={"700"}>{title}</Typography>
                    {rightNode}
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{
                background: (theme) => theme.palette.mode === "dark" ? "#28323c" : "#f1f1f1",
                borderBottomLeftRadius: "16px !important",
                borderBottomRightRadius: "16px !important",
            }} >

                {children}
            </AccordionDetails>
        </Accordion>

    )
}
