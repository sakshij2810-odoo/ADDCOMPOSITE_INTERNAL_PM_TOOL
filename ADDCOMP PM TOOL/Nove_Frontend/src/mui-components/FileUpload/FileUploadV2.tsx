import { Box, Button, Paper, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { IFileUpload, IFileUploadV2Props } from "./FileUpload.type";
import {
  CheckOutlined,
  DescriptionOutlined,
  KeyboardArrowDownRounded,
  UploadFileOutlined,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { MultiFileDisplay } from "./FileUpload";
import { getUniqueId } from "../../helpers";

export const FileUploadV2: React.FC<IFileUploadV2Props> = (props) => {
  const {
    height,
    value,
    onChange,
    onDelete,
    deleteDisabled=false,
    actionButton,
    multiple,
    onMultiChange,
    displayText="Drop documents here to get signed"
  } = props;
  const theme = useTheme();
  const [file, setFile] = React.useState<File | null>(props.file || null);

  const onDrop = 
    (acceptedFiles: File[]) => {
      const files = acceptedFiles;
      if (files && files.length > 0 && !multiple) {
        const file = files[0];
        if (props.onChange) {
          setFile(file);
          props.onChange(file);
        }
      } else if (
        files &&
        files.length > 0 &&
        Array.isArray(value) &&
        multiple
      ) {
        const file = files[0];
        if (onMultiChange) {
          onMultiChange([
            ...value,
            {
              key: getUniqueId(),
              file: file,
              name: file.name,
              path: null,
            },
          ]);
        }
      }
    };
    
  const handleMultiChange = (data: IFileUpload[]) => {
    if (onMultiChange) {
      onMultiChange(data);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = () => {
    if (onDelete) {
      setFile(null);
      onDelete();
    }
  };

  if ((value || file) && multiple && !Array.isArray(value)) {
    return (
      <Paper>
        <Stack
          spacing={2}
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          padding={1}
          sx={{
            minHeight: height || "300px",
            border: `2px dashed ${theme.palette.grey[500]}`,
          }}
        >
          <Stack
            direction={"column"}
            spacing={1}
            alignItems={"center"}
            justifyContent={"center"}
            width={"80%"}
          >
            <Box position={"relative"}>
              <DescriptionOutlined
                sx={{ fontSize: 75, color: theme.palette.grey[500] }}
              />
              <Box
                sx={{
                  position: "absolute",
                  padding: "2px",
                  right: 3,
                  background: theme.palette.success.main,
                  borderRadius: "100%",
                  display: "flex",
                  top: -1,
                }}
              >
                <CheckOutlined sx={{ color: "#fff" }} />
              </Box>
            </Box>

            <Typography
              variant="body1"
              fontSize={"1rem"}
              fontWeight={600}
              sx={{ color: theme.palette.grey[600] }}
            >
              {value || file?.name}
            </Typography>
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <Button
              variant="contained"
              size="large"
              color="error"
              onClick={handleDelete}
            >
              Remove
            </Button>
            {actionButton && (
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={actionButton.onClick}
              >
                {actionButton.text}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <>
      <Stack
        {...getRootProps()}
        spacing={2}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          minHeight: height || "300px",
          border: isDragActive
            ? `2px dashed ${theme.palette.primary.main}`
            : `2px dashed ${theme.palette.grey[500]}`,
        }}
      >
        <>
          <input {...getInputProps()} />
          <UploadFileOutlined
            sx={{ fontSize: 75, color: theme.palette.grey[500] }}
          />
          <Typography
            variant="body1"
            fontSize={"1rem"}
            fontWeight={600}
            sx={{ color: theme.palette.grey[600] }}
          >
            {displayText}
          </Typography>

          <label htmlFor="file-upload">
            <Button
              variant="contained"
              sx={{
                background: isDragActive
                  ? theme.palette.primary.main
                  : theme.palette.grey[300],
                color: isDragActive ? "#fff" : "#000",
                fontSize: "1.2rem",
                fontWeight: 600,
                ":hover": {
                  background: isDragActive
                    ? theme.palette.primary.main
                    : theme.palette.grey[300],
                  color: isDragActive ? "#fff" : "#000",
                },
              }}
              size="large"
            >
              Upload <KeyboardArrowDownRounded fontSize="medium" />
            </Button>
          </label>
        </>
      </Stack>
      {multiple && Array.isArray(value) && (
        <MultiFileDisplay value={value} deleteDisabled={deleteDisabled} onChange={handleMultiChange} />
      )}
    </>
  );
};
