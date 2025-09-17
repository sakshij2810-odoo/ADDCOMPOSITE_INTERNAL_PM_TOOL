import React, { useState } from 'react'
import { IEducationProfile } from 'src/redux/child-reducers'
import { EducationProfileDetails } from './EducationProfileDetails'
import { Dayjs } from 'dayjs'
import { produce } from 'immer'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Typography } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { EducationProfileDailog } from './dialogs/EducationProfileDailog'
import { MuiConfirmDialog } from '../MuiDialogs'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from '../MuiAccordion'


interface IEducationProfileViewProps {
    title: string | React.ReactNode
    data: IEducationProfile[]
    onChange: (edu: IEducationProfile[]) => void

}

export const EducationProfileView: React.FC<IEducationProfileViewProps> = ({ title, data: educationDetails, onChange }) => {
    const [openDetailsPanel, setOpenDetailsPanel] = useState(educationDetails.length === 0 ? false : true)
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
                        Add Deatils
                    </Button>
                }
                sx={{ mt: 2 }}
                disableShadow
            >
                {educationDetails.map((education, e_idx) => {
                    return (
                        <EducationProfileDetails key={e_idx}
                            data={education}
                            onEditClick={() => setOpneAddNewDialog({ index: e_idx, data: education })}
                            ondDeleteClick={() => setOpenDeleteDialog({ index: e_idx, data: education })}
                        />
                    )
                })}
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
