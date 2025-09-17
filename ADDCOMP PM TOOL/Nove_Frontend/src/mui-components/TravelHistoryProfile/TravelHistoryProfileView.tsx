import React, { useState } from 'react'
import { Dayjs } from 'dayjs'
import { produce } from 'immer'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, Typography } from '@mui/material'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import { WorkHistoryDetailsDailog } from './dialogs/TravelHistoryProfileDialog'
import { MuiConfirmDialog } from '../MuiDialogs'
import { ITravelHistoryProfile, IWorkHistoryProfile } from 'src/redux'
// import { WorkHistoryProfileDetails } from './TravelHistoryProfileDetails'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from '../MuiAccordion'
import { TravelHistoryProfileDetails } from './TravelHistoryProfileDetails'


interface ITravelHistoryProfileViewProps {
    title: string | React.ReactNode
    data: ITravelHistoryProfile[]
    onChange: (edu: ITravelHistoryProfile[]) => void

}

export const TravelHistoryProfileView: React.FC<ITravelHistoryProfileViewProps> = ({ title, data: travelHistoryDetails, onChange }) => {

    const [openDetailsPanel, setOpenDetailsPanel] = useState(travelHistoryDetails.length === 0 ? false : true)
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

                {travelHistoryDetails && travelHistoryDetails.map((travelHistory, w_idx) => {
                    return (
                        <TravelHistoryProfileDetails key={w_idx}
                            data={travelHistory}
                            onEditClick={() => setOpneAddNewDialog({ index: w_idx, data: travelHistory })}
                            ondDeleteClick={() => { console.log("WorkHistoryProfileDetails iDx =>", w_idx); setOpenDeleteDialog(w_idx) }}
                        />
                    )
                })}

            </MuiAccordionStandardCard>

            {/* {opneAddNewDialog &&
                <WorkHistoryDetailsDailog
                module={module}
                    open={true}
                    data={opneAddNewDialog}
                    onClose={() => setOpneAddNewDialog(null)}
                    onSaveSuccess={(idx, data) => handlWorkhistorySaveSuccess(idx, data)}
                />} */}

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
