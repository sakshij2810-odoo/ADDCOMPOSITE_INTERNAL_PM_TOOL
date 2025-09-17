import React, { useState } from 'react'
import { Dayjs } from 'dayjs'
import { produce } from 'immer'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { WorkHistoryDetailsDailog } from './dialogs/TravelHistoryProfileDialog'
import { MuiConfirmDialog } from '../MuiDialogs'
import { ITravelHistoryProfile, IWorkHistoryProfile } from 'src/redux'
// import { WorkHistoryProfileDetails } from './TravelHistoryProfileDetails'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from '../MuiAccordion'
import { TravelHistoryProfileDetails } from './TravelHistoryProfileDetails'
import { Scrollbar } from 'src/components/scrollbar'
import { cDate } from 'src/utils/format-date-time'


interface ITravelHistoryProfileTableProps {
    module: "LEAD" | "CUSTOMER"
    title: string | React.ReactNode
    data: ITravelHistoryProfile[]
    onChange: (edu: ITravelHistoryProfile[]) => void

}

export const TravelHistoryProfileTable: React.FC<ITravelHistoryProfileTableProps> = ({ title, module, data: travelHistoryDetails, onChange }) => {

    const [openDetailsPanel, setOpenDetailsPanel] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<number | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: ITravelHistoryProfile | null } | null>(null)


    const handlWorkhistorySaveSuccess = (idx: number | null, eduObj: ITravelHistoryProfile) => {
        const newValues = produce(travelHistoryDetails || [], draftState => {
            if (idx === null) {
                draftState.push(eduObj)
            } else {
                draftState[idx] = eduObj
            }
        })
        onChange(newValues)
    }



    const handlDeleteWorkHistory = (idx: number) => {
        const newValues = produce(travelHistoryDetails || [], draftState => {
            draftState.splice(idx, 1)
        })
        onChange(newValues)
        setOpenDeleteDialog(null)
    }
    return (
        <>
            <MuiAccordionStandardCard
                divider
                expanded={openDetailsPanel}
                onToggle={setOpenDetailsPanel}
                title={title}
                rightNode={
                    <Button variant="contained" size="small"
                        onClick={() => setOpneAddNewDialog({ index: null, data: null })}
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Add Deatils
                    </Button>
                }
                sx={{ mt: 2 }}
                disableShadow
            >
                {travelHistoryDetails.length === 0 ?
                    <Typography variant='body1' textAlign="center">No data available</Typography>
                    :
                    <Scrollbar>
                        <Table   >
                            <TableHead>
                                {module === "LEAD" ?
                                    <TableRow>
                                        <TableCell>Actions</TableCell>
                                        <TableCell>Destination</TableCell>
                                    </TableRow>
                                    :
                                    <TableRow>
                                        <TableCell>Actions</TableCell>
                                        <TableCell>From</TableCell>
                                        <TableCell>To</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Destination</TableCell>
                                        <TableCell>Purpose of travel</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                }
                            </TableHead>
                            <TableBody >
                                {travelHistoryDetails && travelHistoryDetails.map((travelHistory, w_idx) => {
                                    return (
                                        <TravelHistoryProfileTableRow key={w_idx}
                                            module={module}
                                            data={travelHistory}
                                            onEditClick={() => setOpneAddNewDialog({ index: w_idx, data: travelHistory })}
                                            ondDeleteClick={() => setOpenDeleteDialog(w_idx)}
                                        />
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                }



            </MuiAccordionStandardCard>

            {opneAddNewDialog &&
                <WorkHistoryDetailsDailog
                    open={true}
                    module={module}
                    data={opneAddNewDialog}
                    onClose={() => setOpneAddNewDialog(null)}
                    onSaveSuccess={(idx, data) => handlWorkhistorySaveSuccess(idx, data)}
                />}

            {openDeleteDialog !== null && <MuiConfirmDialog
                open={true}
                onClose={() => setOpenDeleteDialog(null)}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => handlDeleteWorkHistory(openDeleteDialog)}>
                        Delete
                    </Button>
                }
            />}

        </>
    )
}



interface ITravelHistoryProfileTableRowProps {
    module: "LEAD" | "CUSTOMER"
    data: ITravelHistoryProfile
    onEditClick: () => void
    ondDeleteClick: () => void

}

const TravelHistoryProfileTableRow: React.FC<ITravelHistoryProfileTableRowProps> = ({ data, module, onEditClick, ondDeleteClick }) => {
    return (
        <TableRow>
            <TableCell sx={{ minWidth: 120 }}>
                <Tooltip title="Edit">
                    <IconButton onClick={onEditClick}><Iconify icon="solar:pen-bold" /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color='error' onClick={ondDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                </Tooltip>
            </TableCell>
            {module === "LEAD" ? (
                <TableCell>{data.destination}</TableCell>
            ) : (
                <>
                    <TableCell>{cDate(data.from_date)}</TableCell>
                    <TableCell>{cDate(data.to_date)}</TableCell>
                    <TableCell>{data.duration}</TableCell>
                    <TableCell>{data.destination}</TableCell>
                    <TableCell>{data.purpose_of_travel}</TableCell>
                    <TableCell>{data.description}</TableCell>
                </>
            )}
        </TableRow>
    )
}
