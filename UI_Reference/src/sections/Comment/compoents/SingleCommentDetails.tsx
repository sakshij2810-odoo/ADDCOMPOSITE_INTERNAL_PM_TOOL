import { Avatar, Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { IComment } from 'src/redux'
import { fDate } from 'src/utils/format-time'

interface ISingleCommentDetailsPoprs {
  comment: IComment
}
export const SingleCommentDetails: React.FC<ISingleCommentDetailsPoprs> = ({ comment }) => {
  const { created_by_name, comment_remark, create_ts } = comment
  return (
    <Box
      sx={{
        pt: 3,
        display: 'flex',
        position: 'relative',
        // ...(hasReply && { pl: 8 }),
        borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`
      }}
    >
      <Avatar alt={created_by_name || ""} src={""} sx={{ mr: 2, width: 48, height: 48 }} />

      <Stack
        flexGrow={1}
        sx={{ pb: 3 }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {created_by_name}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDate(create_ts)}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {/* {tagUser && (
            <Box component="strong" sx={{ mr: 0.5 }}>
              @{tagUser}
            </Box>
          )} */}
          {comment_remark}
        </Typography>

        {/* {reply.value && (
          <Box sx={{ mt: 2 }}>
            <TextField fullWidth autoFocus placeholder="Write comment..." />
          </Box>
        )} */}
      </Stack>

    </Box>
  )
}
