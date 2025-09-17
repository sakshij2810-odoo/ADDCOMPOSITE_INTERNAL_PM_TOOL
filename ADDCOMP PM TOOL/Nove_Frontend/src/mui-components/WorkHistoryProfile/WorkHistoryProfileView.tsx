import React, { useState } from 'react'
import { Dayjs } from 'dayjs'
import { produce } from 'immer'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Typography } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { WorkHistoryDetailsDailog } from './dialogs/WorkHistoryProfileDialog'
import { MuiConfirmDialog } from '../MuiDialogs'
import { IWorkHistoryProfile } from 'src/redux'
import { WorkHistoryProfileDetails } from './WorkHistoryProfileDetails'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from '../MuiAccordion'


interface IWorkHistoryProfileViewProps {
    title: string | React.ReactNode
    data: IWorkHistoryProfile[]
    onChange: (edu: IWorkHistoryProfile[]) => void

}

export const WorkHistoryProfileView: React.FC<IWorkHistoryProfileViewProps> = ({ title, data: educationDetails, onChange }) => {

    const [openDetailsPanel, setOpenDetailsPanel] = useState(educationDetails.length === 0 ? false : true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<number | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: IWorkHistoryProfile | null } | null>(null)


    const handlWorkhistorySaveSuccess = (idx: number | null, eduObj: IWorkHistoryProfile) => {
        const newValues = produce(educationDetails, draftState => {
            if (idx === null) {
                draftState.push(eduObj)
            } else {
                draftState[idx] = eduObj
            }
        })
        onChange(newValues)
    }



    const handlDeleteWorkHistory = (idx: number) => {
        const newValues = produce(educationDetails, draftState => {
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

                {educationDetails.map((education, w_idx) => {
                    return (
                        <WorkHistoryProfileDetails key={w_idx}
                            data={education}
                            onEditClick={() => setOpneAddNewDialog({ index: w_idx, data: education })}
                            ondDeleteClick={() => { console.log("WorkHistoryProfileDetails iDx =>", w_idx); setOpenDeleteDialog(w_idx) }}
                        />
                    )
                })}
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
