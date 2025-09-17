/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-curly-brace-presence */
import React from "react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import { ContentCopyOutlined, Delete, Download, Email, SettingsBackupRestore } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
  IconButton
} from "@mui/material";

import { Iconify } from "src/components/iconify";

import { Dialog } from "../Dialogs/Dialog";
import { ContextMenu } from "../ContextMenu/ContextMenu";

import type { IStandardTableActionsProps } from "./StandardTableActions.types";
// import { CommentsSideBar } from "../CommentsSideBar/CommentsSideBar";
// import { HistorySideBar } from "../HistorySideBar/HistorySideBar";

export const StandardTableActions: React.FC<IStandardTableActionsProps> = (
  props
) => {
  const {
    onViewClick,
    onEditClick,
    onDownLoadClick,
    onDownloadPreview,
    onDuplicateClick,
    onDeleteClick,
    onRestoreClick,
    onEmailClick,
    downloadLoading,
    more,
    commentBoxTypeId,
    historyCompData,
    onCreateClick
  } = props;


  return (
    <>
      <Stack
        direction={'row'}
        justifyContent={'center'}
        sx={{
          svg: {
            cursor: "pointer",
          },
        }}
      >
        {/* {historyCompData && <HistorySideBar module_code={historyCompData.module_code}  />} */}


        {/* {commentBoxTypeId && <CommentsSideBar typeId={commentBoxTypeId} />} */}

        {onViewClick && (

          <IconButton onClick={onViewClick}>
            <Tooltip title="View">
              <VisibilityIcon color="primary" />
            </Tooltip>
          </IconButton>
        )}
        {onEditClick && (
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton
              color={'default'}
              onClick={onEditClick}
            >
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        )}
        {onEmailClick && (
          <IconButton color={'default'} onClick={onEmailClick}>
            <Tooltip title="Email">
              <Email color="primary" />
            </Tooltip>
          </IconButton>
        )}
        {onDuplicateClick && (
          <Tooltip title="Duplicate">
            <IconButton onClick={onDuplicateClick} color={'default'}>
              <Iconify icon="solar:copy-outline" />
            </IconButton>
          </Tooltip>
        )}
        {onDownloadPreview && (
          <IconButton onClick={onDownloadPreview} color={'default'}>
            <Tooltip title="Preview">
              <ContentPasteSearchOutlinedIcon color="primary" />
            </Tooltip>
          </IconButton>
        )}
        {onDownLoadClick && (
          <IconButton onClick={!downloadLoading ? onDownLoadClick : undefined} color={'default'}>
            <Tooltip title="Download" >
              <Download color="primary" />
            </Tooltip>
          </IconButton>
        )}
        {onCreateClick && (
          <Tooltip title="Create">
            <IconButton onClick={onCreateClick}>
              <Iconify icon="material-symbols:add" />
            </IconButton>
          </Tooltip>

        )}
        {onDeleteClick && (
          <Tooltip title="Delete">
            <IconButton onClick={onDeleteClick}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}
        {onRestoreClick && (
          <Box onClick={onRestoreClick}>
            <Tooltip title="Restore">
              <SettingsBackupRestore color="primary" />
            </Tooltip>
          </Box>
        )}

        {more && <ContextMenu menuOptions={more.menuItems}></ContextMenu>}
      </Stack>
      {downloadLoading && (
        <Dialog
          open={downloadLoading || false}
          size="sm"
          onClose={() => { }}
          title=""
        >
          <Stack
            minHeight={"200px"}
            justifyContent={"center"}
            direction={"column"}
            alignItems={"center"}
          >
            <CircularProgress size={40} />
            <Typography variant="h3" marginTop={2}>
              Download in progress..
            </Typography>
          </Stack>
        </Dialog>
      )}
    </>
  );
};