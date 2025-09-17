import React, { useState } from 'react'
import { produce } from 'immer'
import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material'
import { WorkHistoryDetailsDailog } from './dialogs/WorkHistoryProfileDialog'
import { MuiConfirmDialog } from '../MuiDialogs'
import { IWorkHistoryProfile } from 'src/redux'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from '../MuiAccordion'
import { Scrollbar } from 'src/components/scrollbar'
import { capitalizeUnderScoreWords } from 'src/utils/format-word'
import { cDate } from 'src/utils/format-date-time'
import { Typography } from '@mui/material'


interface IWorkHistoryProfileTableProps {
    hasWWorkExperience: boolean
    title: string | React.ReactNode
    data: IWorkHistoryProfile[]
    onChange: (edu: IWorkHistoryProfile[]) => void

}

export const WorkHistoryProfileTable: React.FC<IWorkHistoryProfileTableProps> = ({ title, data: workHistoryDetails, hasWWorkExperience, onChange }) => {

    const [openDetailsPanel, setOpenDetailsPanel] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<number | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: IWorkHistoryProfile | null } | null>(null)


    const handlWorkhistorySaveSuccess = (idx: number | null, eduObj: IWorkHistoryProfile) => {
        const newValues = produce(workHistoryDetails, draftState => {
            if (idx === null) {
                draftState.push(eduObj)
            } else {
                draftState[idx] = eduObj
            }
        })
        onChange(newValues)
    }



    const handlDeleteWorkHistory = (idx: number) => {
        const newValues = produce(workHistoryDetails, draftState => {
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
                rightNode={!hasWWorkExperience && (
                    <Button variant="contained" size="small"
                        onClick={() => setOpneAddNewDialog({ index: null, data: null })}
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Add Details
                    </Button>)
                }
                sx={{ mt: 2 }}
                isExpandIconVisible={!hasWWorkExperience}
                disableShadow
            >
                {workHistoryDetails.length === 0 ?
                    <Typography variant='body1' textAlign="center">No data available</Typography>
                    :
                    <Scrollbar>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Actions</TableCell>
                                    <TableCell>Designation</TableCell>
                                    <TableCell>Employement Type</TableCell>
                                    <TableCell>From Date</TableCell>
                                    <TableCell>To Date</TableCell>
                                    <TableCell>Company Location</TableCell>
                                    <TableCell>Location Type</TableCell>
                                    <TableCell>Work Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workHistoryDetails.map((education, w_idx) => {
                                    return (
                                        <WorkHistoryProfileTableRow key={w_idx}
                                            data={education}
                                            onEditClick={() => setOpneAddNewDialog({ index: w_idx, data: education })}
                                            ondDeleteClick={() => { console.log("WorkHistoryProfileDetails iDx =>", w_idx); setOpenDeleteDialog(w_idx) }}
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



interface IWorkHistoryProfileTableRowProps {
    data: IWorkHistoryProfile
    onEditClick: () => void
    ondDeleteClick: () => void
}

export const WorkHistoryProfileTableRow: React.FC<IWorkHistoryProfileTableRowProps> = ({ data, onEditClick, ondDeleteClick }) => {
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
            <TableCell>{data.designation}</TableCell>

            <TableCell>{capitalizeUnderScoreWords(data.employement_type as string)}</TableCell>
            <TableCell sx={{ minWidth: 120 }}>{cDate(data.from)}</TableCell>
            <TableCell sx={{ minWidth: 120 }}>{cDate(data.to)}</TableCell>
            <TableCell>{data.company_location}</TableCell>
            <TableCell>{capitalizeUnderScoreWords(data.location_type as string)}</TableCell>
            <TableCell>{data.work_description}</TableCell>
        </TableRow>
    )
}
