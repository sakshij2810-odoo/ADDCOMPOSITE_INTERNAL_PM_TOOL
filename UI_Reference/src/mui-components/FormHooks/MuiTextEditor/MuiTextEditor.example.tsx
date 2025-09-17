import { Box, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { MuiTextEditor } from './MuiTextEditor'

export const MuiTextEditorExamples = () => {
    const [editorContent, setEditorContent] = useState<string>("")

    console.log("editorContent ===>", editorContent)
    return (
        <MuiStandardCard title="Material UI Text Editor Examples" divider sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} ><Typography variant="subtitle2">UnControlled Editor</Typography></Grid>
                <Grid item xs={12} md={12}>
                    <MuiTextEditor />
                </Grid>


                <Grid item xs={12} ><Typography variant="subtitle2">Controlled Editor With Output</Typography></Grid>
                <Grid item xs={12} md={12}>
                    <MuiTextEditor value={editorContent} onChange={(content) => setEditorContent(content)} />
                    {editorContent && <Box dangerouslySetInnerHTML={{ __html: editorContent }} />}
                </Grid>
            </Grid>

        </MuiStandardCard>
    )
}
