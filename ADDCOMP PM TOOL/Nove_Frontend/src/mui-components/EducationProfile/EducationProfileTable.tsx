import React, { useState } from 'react'
import { IEducationProfile } from 'src/redux/child-reducers'
import { produce } from 'immer'
import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { EducationProfileDailog } from './dialogs/EducationProfileDailog'
import { MuiConfirmDialog } from '../MuiDialogs'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from '../MuiAccordion'
import { Scrollbar } from 'src/components/scrollbar'
import { getLevelOfEducationLabel } from './EducationProfile.constants'
import { cDate } from 'src/utils/format-date-time'


interface IEducationProfileTableProps {
    title: string | React.ReactNode
    data: IEducationProfile[]
    onChange: (edu: IEducationProfile[]) => void

}

export const EducationProfileTable: React.FC<IEducationProfileTableProps> = ({ title, data: educationDetails, onChange }) => {
    const [openDetailsPanel, setOpenDetailsPanel] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<{ index: number, data: IEducationProfile } | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: IEducationProfile | null } | null>(null)



    const handlEducationSaveSuccess = (idx: number | null, eduObj: IEducationProfile) => {
        const newValues = produce(educationDetails, draftState => {
            if (idx === null) {
                draftState.push(eduObj)
            } else {
                draftState[idx] = eduObj
            }

        })
        onChange(newValues)
    }

    const handlDeleteEducation = (idx: number) => {
        const newValues = produce(educationDetails, draftState => {
            draftState.splice(idx, 1)
        })
        onChange(newValues)
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
                {educationDetails.length === 0 ?
                    <Typography variant='body1' textAlign="center">No data available</Typography>
                    :
                    <Scrollbar>
                        <Table   >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Actions</TableCell>
                                    <TableCell>Qualification</TableCell>
                                    <TableCell>From Date</TableCell>
                                    <TableCell>To Date</TableCell>
                                    <TableCell>School or University</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {educationDetails.map((education, e_idx) => {
                                    return (
                                        <EducationProfileTableRow key={e_idx}
                                            data={education}
                                            onEditClick={() => setOpneAddNewDialog({ index: e_idx, data: education })}
                                            ondDeleteClick={() => setOpenDeleteDialog({ index: e_idx, data: education })}
                                        />
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                }


            </MuiAccordionStandardCard>

            {opneAddNewDialog &&
                <EducationProfileDailog
                    open={true}
                    data={opneAddNewDialog}
                    onClose={() => setOpneAddNewDialog(null)}
                    onSaveSuccess={(idx, data) => handlEducationSaveSuccess(idx, data)}
                />}
            {openDeleteDialog !== null && <MuiConfirmDialog
                open={true}
                onClose={() => setOpenDeleteDialog(null)}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => handlDeleteEducation(openDeleteDialog.index)}>
                        Delete
                    </Button>
                }
            />}
        </>
    )
}




interface IEducationProfileTableRowProps {
    data: IEducationProfile
    onEditClick: () => void
    ondDeleteClick: () => void
}

const EducationProfileTableRow: React.FC<IEducationProfileTableRowProps> = ({ data, onEditClick, ondDeleteClick }) => {
    return (
        <>
            <TableRow>
                <TableCell sx={{ minWidth: 120 }}>
                    <Tooltip title="Edit">
                        <IconButton onClick={onEditClick}><Iconify icon="solar:pen-bold" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton color='error' onClick={ondDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                    </Tooltip>
                </TableCell>
                <TableCell>{getLevelOfEducationLabel(data.qualification)}</TableCell>
                <TableCell sx={{ minWidth: 120 }}>{cDate(data.from)}</TableCell>
                <TableCell sx={{ minWidth: 120 }}>{cDate(data.to)}</TableCell>
                <TableCell>{data.school_or_university}</TableCell>
            </TableRow>
        </>

    )
}