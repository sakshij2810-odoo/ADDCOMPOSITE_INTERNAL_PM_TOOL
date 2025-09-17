import React, { useState } from 'react'
import { ICustomerRelativeDetail, IEducationProfile } from 'src/redux/child-reducers'
import { CustomerRelativeInformationRow } from './CustomerRelativeInformationRow'
import { produce } from 'immer'
import { Box, Button, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from 'src/mui-components'
import { MuiConfirmDialog } from 'src/mui-components/MuiDialogs'
import { QuestionsOptionRow } from 'src/views/application/management/document-checklist-and-services/questions/components/QuestionsTable/QuestionsOptionRow'
import { CustomerRelativeInformationDailog } from './dialogs/CustomerRelativeInformationDailog'
import { Scrollbar } from 'src/components/scrollbar'


interface ICustomerRelativeInformationViewProps {
    title: string | React.ReactNode
    data: ICustomerRelativeDetail[]
    onChange: (edu: ICustomerRelativeDetail[]) => void

}

export const CustomerRelativeInformationView: React.FC<ICustomerRelativeInformationViewProps> = ({ title, data: educationDetails, onChange }) => {
    const [openDetailsPanel, setOpenDetailsPanel] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<{ index: number, data: ICustomerRelativeDetail } | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: ICustomerRelativeDetail | null } | null>(null)



    const handlEducationSaveSuccess = (idx: number | null, eduObj: ICustomerRelativeDetail) => {
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
                <Typography variant='subtitle1'>Relative Details and Status</Typography>
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
                                <TableCell>Relative Name</TableCell>
                                <TableCell>Relationship</TableCell>
                                <TableCell>Present Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {educationDetails.map((education, e_idx) => {
                                return (
                                    <CustomerRelativeInformationRow key={e_idx}
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
                <CustomerRelativeInformationDailog
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
