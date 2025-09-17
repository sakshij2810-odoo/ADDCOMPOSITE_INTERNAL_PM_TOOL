import React, { useState } from 'react'
import { ICustomerFamilyInformation, IEducationProfile } from 'src/redux/child-reducers'
import { AdditionalFamilyInformationRow } from './AdditionalFamilyInformationRow'
import { produce } from 'immer'
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { AdditionalFamilyInformationDailog } from './dialogs/AdditionalFamilyInformationDailog'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from 'src/mui-components'
import { MuiConfirmDialog } from 'src/mui-components/MuiDialogs'
import { QuestionsOptionRow } from 'src/views/application/management/document-checklist-and-services/questions/components/QuestionsTable/QuestionsOptionRow'
import { Scrollbar } from 'src/components/scrollbar'


interface IAdditionalFamilyInformationViewProps {
    title: string | React.ReactNode
    data: ICustomerFamilyInformation[]
    onChange: (edu: ICustomerFamilyInformation[]) => void

}

export const AdditionalFamilyInformationView: React.FC<IAdditionalFamilyInformationViewProps> = ({ title, data: educationDetails, onChange }) => {
    const [openDetailsPanel, setOpenDetailsPanel] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<{ index: number, data: ICustomerFamilyInformation } | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: ICustomerFamilyInformation | null } | null>(null)



    const handlEducationSaveSuccess = (idx: number | null, eduObj: ICustomerFamilyInformation) => {
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
                {educationDetails.length === 0 ?
                    <Typography variant='body1' textAlign="center">No data available</Typography>
                    :
                    <Scrollbar>
                        <Table   >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Actions</TableCell>
                                    <TableCell>Relationship</TableCell>
                                    <TableCell>Is accompany with you</TableCell>
                                    <TableCell>Member First Name</TableCell>
                                    <TableCell>Member Last Name</TableCell>
                                    <TableCell>Member BOB</TableCell>
                                    <TableCell>Place of Birth</TableCell>
                                    <TableCell>Current Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {educationDetails.map((education, e_idx) => {
                                    return (
                                        <AdditionalFamilyInformationRow key={e_idx}
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
                <AdditionalFamilyInformationDailog
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
