import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { Dialog } from 'src/mui-components/Dialogs/Dialog'
import { MuiInfoDialog } from 'src/mui-components/Dialogs/MuiInfoDialog'
import { getGeneralProcessStatusAsync } from 'src/services/general-services'
import axios_base_api, { server_base_endpoints } from 'src/utils/axios-base-api'
import { ServiceTypeDropdown } from 'src/views/application/management/services'
import { StatesDropdown } from 'src/views/application/management/services/dropdowns/StatesDropdown'

interface IChooseLeadServiceDialogProps {
    open: boolean,
    process_code: string
    onClose: () => void
}
export const ImportLeadProgressDialog: React.FC<IChooseLeadServiceDialogProps> = ({
    open, onClose, process_code
}) => {

    const [processStatus, setProcessStatus] = useState<string | null>(null)
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (processStatus === "COMPLETED") return;
            getGeneralProcessStatusAsync(process_code).then((result) => {
                if (result?.status) {
                    setProcessStatus(result.status);
                }
            });
        }, 5000);

        return () => clearInterval(intervalId); // cleanup on unmount or dependency change
    }, [process_code, processStatus]);

    return (
        <Dialog size="sm" open={open} onClose={onClose} title='Import Lead Dialog'
            actions={[
                {
                    disabled: processStatus === "IN_PROGRESS",
                    type: "button",
                    label: "Close",
                    variant: "contained",
                    onClick: onClose
                }
            ]}
            contentSx={{ padding: 2 }}
        >
            {processStatus === "FAILED" ?
                <Box sx={{ width: "100%", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
                    <Typography variant='h5' >Something wrong happened, please try again.</Typography>
                </Box>
                : processStatus !== "COMPLETED" ?
                    <Box sx={{ width: "100%", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
                        <CircularProgress size={40} />
                        <Typography variant='h5' >Import Lead is in progress, please wait...!</Typography>
                    </Box>
                    :
                    <Box sx={{ width: "100%", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
                        <Typography variant='h5' >Lead Imported Successfully.</Typography>
                    </Box>
            }
        </Dialog>
    )
}


