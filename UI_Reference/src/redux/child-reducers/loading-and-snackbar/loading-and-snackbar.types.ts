import { AlertProps } from "@mui/material"


export type ISnakbarContent = {
    variant?: AlertProps["severity"]
    message: string
}


export interface ILoadingAndSnackbarState {
    loading: {
        visible: boolean,
        message?: string
    }
    snackbar: {
        visible: boolean,
        content: ISnakbarContent
    }
}