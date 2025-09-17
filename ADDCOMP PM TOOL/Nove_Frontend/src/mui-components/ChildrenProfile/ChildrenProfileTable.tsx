import React, { ChangeEvent, ChangeEventHandler, useState } from 'react'
import { produce } from 'immer'
import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material'
import { calculateAgeFromISO, ChildrenDetailsDailog } from './dialogs/ChildrenDetailsDailog'
import { MuiConfirmDialog } from '../MuiDialogs'
import { defaultChildrenProfile, IChildrenProfile } from 'src/redux'
import { Iconify } from 'src/components/iconify'
import { MuiAccordionStandardCard } from '../MuiAccordion'
import { Scrollbar } from 'src/components/scrollbar'
import { capitalizeUnderScoreWords } from 'src/utils/format-word'
import { cDate } from 'src/utils/format-date-time'
import { Typography } from '@mui/material'
import { MuiFormFields } from '../FormHooks'


interface IChildrenProfileTableProps {
    title: string | React.ReactNode
    data: IChildrenProfile[]
    onChange: (edu: IChildrenProfile[]) => void

}

export const ChildrenProfileTable: React.FC<IChildrenProfileTableProps> = ({ title, data: workHistoryDetails, onChange }) => {

    const [openDetailsPanel, setOpenDetailsPanel] = useState(true)
    const [openDeleteDialog, setOpenDeleteDialog] = useState<number | null>(null)
    const [opneAddNewDialog, setOpneAddNewDialog] = useState<{ index: number | null, data: IChildrenProfile | null } | null>(null)


    const handlWorkhistorySaveSuccess = (idx: number | null, eduObj: IChildrenProfile) => {
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


    const handleAddNewClick = () => {
        onChange([...workHistoryDetails, defaultChildrenProfile])
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
                        onClick={handleAddNewClick}
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Add Deatils
                    </Button>
                }
                sx={{ mt: 2 }}
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
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Date Of Birth</TableCell>
                                    <TableCell>Age</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workHistoryDetails.map((education, w_idx) => {
                                    return (
                                        <WorkHistoryProfileTableRow key={w_idx}
                                            data={education}
                                            onEditClick={() => setOpneAddNewDialog({ index: w_idx, data: education })}
                                            onDeleteClick={() => { console.log("WorkHistoryProfileDetails iDx =>", w_idx); setOpenDeleteDialog(w_idx) }}
                                            onChange={(data) => {
                                                const newValues = produce(workHistoryDetails, draftState => {
                                                    draftState[w_idx] = data
                                                })
                                                onChange(newValues)
                                            }}
                                        />
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                }

            </MuiAccordionStandardCard>

            {opneAddNewDialog &&
                <ChildrenDetailsDailog
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



interface IChildrenProfileTableRowProps {
    data: IChildrenProfile
    onEditClick: () => void
    onDeleteClick: () => void
    onChange: (data: IChildrenProfile) => void
}

export const WorkHistoryProfileTableRow: React.FC<IChildrenProfileTableRowProps> = ({ data, onEditClick, onDeleteClick, onChange }) => {

    const handleFieldChange = (key: keyof IChildrenProfile, value: string) => {
        onChange(produce(data, draftState => {
            draftState[key as "first_name"] = value;
            if (key === "date_of_birth") {
                draftState.age = calculateAgeFromISO(value);
            }
        }));
    }

    return (
        <TableRow>
            <TableCell sx={{ minWidth: 120 }}>
                <Tooltip title="Edit">
                    <IconButton onClick={onEditClick}><Iconify icon="solar:pen-bold" /></IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color='error' onClick={onDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                </Tooltip>
            </TableCell>
            <TableCell>
                <MuiFormFields.MuiTextField
                    name="first_name" value={data.first_name}
                    onChange={(evt) => handleFieldChange("first_name", evt.target.value)}
                />
            </TableCell>
            <TableCell>

                <MuiFormFields.MuiTextField
                    name="last_name" value={data.last_name}
                    onChange={(evt) => handleFieldChange("last_name", evt.target.value)}
                />
            </TableCell>
            <TableCell sx={{ minWidth: 120 }}>
                <MuiFormFields.MuiDatePickerV2
                    value={data.date_of_birth} onChange={(value) => handleFieldChange("date_of_birth", value as string)}
                />
            </TableCell>
            <TableCell>
                {data.age > 0 && <Typography variant="body2"
                    sx={{ fontStyle: 'italic' }}
                    color="textSecondary">{`${data.age} year${data.age > 1 ? 's' : ''} old`}</Typography>}
            </TableCell>
        </TableRow>
    )
}
