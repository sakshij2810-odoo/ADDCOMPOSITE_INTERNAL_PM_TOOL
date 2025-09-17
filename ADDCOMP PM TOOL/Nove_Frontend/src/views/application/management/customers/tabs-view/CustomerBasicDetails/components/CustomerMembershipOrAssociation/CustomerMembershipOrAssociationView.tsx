import React, { useState } from 'react'
import { ICustomerMembershipOrAssociation, IEducationProfile } from 'src/redux/child-reducers'
import { CustomerMembershipOrAssociationRow } from './CustomerMembershipOrAssociationRow'
import { produce } from 'immer'
import { Box, Button, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from 'src/mui-components'
import { MuiConfirmDialog } from 'src/mui-components/MuiDialogs'
import { QuestionsOptionRow } from 'src/views/application/management/document-checklist-and-services/questions/components/QuestionsTable/QuestionsOptionRow'
import { CustomerMembershipOrAssociationDialog } from './dialogs/CustomerMembershipOrAssociationDialog'
import { Scrollbar } from 'src/components/scrollbar'


interface ICustomerMembershipOrAssociationViewProps {
    title: string | React.ReactNode
    data: ICustomerMembershipOrAssociation[]
    onChange: (edu: ICustomerMembershipOrAssociation[]) => void

}

export const CustomerMembershipOrAssociationView: React.FC<ICustomerMembershipOrAssociationViewProps> = ({ title, data: educationDetails, onChange }) => {
    const [openDetailsPanel, setOpenDetailsPanel] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<{ index: number, data: ICustomerMembershipOrAssociation } | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: ICustomerMembershipOrAssociation | null } | null>(null)



    const handlEducationSaveSuccess = (idx: number | null, eduObj: ICustomerMembershipOrAssociation) => {
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
            <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='subtitle1'>Memberhsip Details</Typography>
                <Button variant="contained" size="small"
                    onClick={() => setOpneAddNewDialog({ index: null, data: null })}
                    startIcon={<Iconify icon="mingcute:add-line" />}
                >
                    Add Deatils
                </Button>
            </Box>
            <Divider />
            {educationDetails.length === 0 ?
                <Typography variant='body1' mt={1} textAlign="center">No data available</Typography>
                :
                <Scrollbar>
                    <Table   >
                        <TableHead>
                            <TableRow>
                                <TableCell>Actions</TableCell>
                                <TableCell>From Date</TableCell>
                                <TableCell>From Date</TableCell>
                                <TableCell>Rank</TableCell>
                                <TableCell>Branch or Officer Name</TableCell>
                                <TableCell>Place</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {educationDetails.map((education, e_idx) => {
                                return (
                                    <CustomerMembershipOrAssociationRow key={e_idx}
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

            {opneAddNewDialog &&
                <CustomerMembershipOrAssociationDialog
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
