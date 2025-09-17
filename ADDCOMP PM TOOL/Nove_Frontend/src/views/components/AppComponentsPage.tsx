import { Grid, Typography } from '@mui/material'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import { DashboardContent } from 'src/layouts/dashboard'
import { MuiAutocompleteExamples } from 'src/mui-components/FormHooks/MuiAutocomplete/MuiAutocomplete.examples'
import { MuiCheckBoxExamples } from 'src/mui-components/FormHooks/MuiCheckBox/MuiCheckBox.example'
import { MuiDatePickerExamples } from 'src/mui-components/FormHooks/MuiDatePicker/MuiDatePicker.example'
import { MuiRadioGroupExamples } from 'src/mui-components/FormHooks/MuiRadioGroup/MuiRadioGroup.example'
import { MuiSelectExamples } from 'src/mui-components/FormHooks/MuiSelect/MuiSelect.example'
import { MuiSwitchExamples } from 'src/mui-components/FormHooks/MuiSwitch/MuiSwitch.example'
import { MuiTextEditorExamples } from 'src/mui-components/FormHooks/MuiTextEditor/MuiTextEditor.example'
import { MuiTextFieldExamples } from 'src/mui-components/FormHooks/MuiTextField/MuiTextField.example'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'

const AppComponentsPage = () => {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Components"
                links={[]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <MuiTextFieldExamples />
            <MuiSelectExamples />
            <MuiDatePickerExamples />
            <MuiRadioGroupExamples />
            <MuiCheckBoxExamples />
            <MuiSwitchExamples />
            <MuiTextEditorExamples />
            <MuiAutocompleteExamples />

            <MuiStandardCard title="Title" divider sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    Paste Next Component here...
                </Grid>
            </MuiStandardCard>

        </DashboardContent>
    )
}

export default AppComponentsPage