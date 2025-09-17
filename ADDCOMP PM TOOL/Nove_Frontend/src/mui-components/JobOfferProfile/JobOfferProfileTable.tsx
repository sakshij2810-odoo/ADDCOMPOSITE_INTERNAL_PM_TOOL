import React, { useState } from 'react'
import { produce } from 'immer'
import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material'
import { MuiConfirmDialog } from '../MuiDialogs'
import { IJobOffer } from 'src/redux'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from '../MuiAccordion'
import { Scrollbar } from 'src/components/scrollbar'
import { Typography } from '@mui/material'
import { JobOfferDetailsDailog } from './dialogs/JobOfferDetailsDailog'


interface IJobOfferTableProps {
    title: string | React.ReactNode
    data: IJobOffer[]
    onChange: (edu: IJobOffer[]) => void

}

export const JobOfferProfileTable: React.FC<IJobOfferTableProps> = ({ title, data: jobOfferDetails, onChange }) => {

    const [openDetailsPanel, setOpenDetailsPanel] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<number | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: IJobOffer | null } | null>(null)


    const handljobOfferSaveSuccess = (idx: number | null, eduObj: IJobOffer) => {
        const newValues = produce(jobOfferDetails, draftState => {
            if (idx === null) {
                draftState.push(eduObj)
            } else {
                draftState[idx] = eduObj
            }
        })
        onChange(newValues)
    }



    const handlDeletejobOffer = (idx: number) => {
        const newValues = produce(jobOfferDetails, draftState => {
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
                        Add Details
                    </Button>
                }
                sx={{ mt: 2 }}
                disableShadow
            >
                {jobOfferDetails.length === 0 ?
                    <Typography variant='body1' textAlign="center">No data available</Typography>
                    :
                    <Scrollbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Actions</TableCell>
                                    <TableCell>NOC Category</TableCell>
                                    <TableCell>TEER Category</TableCell>
                                    <TableCell>Wage</TableCell>
                                    <TableCell>Work Permit Status</TableCell>
                                    <TableCell>Job Tenure</TableCell>
                                    <TableCell>Earning History</TableCell>
                                    <TableCell>Location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobOfferDetails.map((education, w_idx) => {
                                    return (
                                        <JobOfferProfileTableRow key={w_idx}
                                            data={education}
                                            onEditClick={() => setOpneAddNewDialog({ index: w_idx, data: education })}
                                            ondDeleteClick={() => { console.log("jobOfferProfileDetails iDx =>", w_idx); setOpenDeleteDialog(w_idx) }}
                                        />
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                }

            </MuiAccordionStandardCard>

            {opneAddNewDialog &&
                <JobOfferDetailsDailog
                    open={true}
                    data={opneAddNewDialog}
                    onClose={() => setOpneAddNewDialog(null)}
                    onSaveSuccess={(idx, data) => handljobOfferSaveSuccess(idx, data)}
                />}

            {openDeleteDialog !== null && <MuiConfirmDialog
                open={true}
                onClose={() => setOpenDeleteDialog(null)}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => handlDeletejobOffer(openDeleteDialog)}>
                        Delete
                    </Button>
                }
            />}

        </>
    )
}



interface IJobOfferTableRowProps {
    data: IJobOffer
    onEditClick: () => void
    ondDeleteClick: () => void
}

export const JobOfferProfileTableRow: React.FC<IJobOfferTableRowProps> = ({ data, onEditClick, ondDeleteClick }) => {
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
            <TableCell>{data.noc_category}</TableCell>
            <TableCell>{data.teer_category}</TableCell>
            <TableCell>{data.wage}</TableCell>
            <TableCell>{data.work_permit_status}</TableCell>
            <TableCell>{data.job_tenure}</TableCell>
            <TableCell>{data.earnings_history}</TableCell>
            <TableCell>{data.location}</TableCell>
        </TableRow>
    )
}
