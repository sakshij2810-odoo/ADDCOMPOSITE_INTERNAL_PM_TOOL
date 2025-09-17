import {
  Box,
  LinearProgress,
  Stack,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import {
  DeleteOutlined,
  Download,
  FileUploadOutlined,
  InsertDriveFileOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { IFileUpload, IFileUploadProps } from "./FileUpload.type";
import { produce } from "immer";
import { downLoadFile, getFileNameFromUrl, previewFile } from "./utils";
import { getUniqueId } from "../../helpers";
import { useDropzone } from "react-dropzone";

export const FileUpload: React.FC<IFileUploadProps> = (props) => {
  const {
    title = "",
    value,
    multiple = false,
    disabled = false,
    deleteDisabled,
    onMultiChange,
  } = props;

  const [localFile, setLocalFile] = React.useState<File | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const files = acceptedFiles;
      if (files && files.length > 0 && !multiple) {
        const file = files[0];
        if (props.onChange) {
          setLocalFile(file);
          props.onChange(file);
        }
      } else if (
        files &&
        files.length > 0 &&
        Array.isArray(value) &&
        multiple
      ) {
        const file = files[0];
        if (props.onMultiChange) {
          props.onMultiChange([
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
    },
    [value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = () => {
    setLocalFile(null);
    if (props.onDelete) {
      props.onDelete();
    }
  };

  const handleMultiChange = (data: IFileUpload[]) => {
    if (onMultiChange) {
      onMultiChange(data);
    }
  };

  if (!multiple && !Array.isArray(value)) {
    return (
      <Box width={"100%"}>
        <Typography fontWeight={600}>{title}</Typography>

        {!localFile && !value && (
          <Stack
            {...getRootProps()}
            marginTop={1}
            padding={2}
            direction={"row"}
            justifyContent={"center"}
            borderRadius={1}
            minHeight={"50px"}
            sx={(theme) => ({
              border: isDragActive
                ? `2px dashed ${theme.palette.primary.main}`
                : `2px dashed ${theme.palette.grey[500]}`,
              opacity: disabled ? 0.4 : 1,
              cursor: disabled ? "not-allowed" : "auto",
            })}
          >
            <input {...getInputProps()} />

            <Stack
              direction={"row"}
              justifyContent={"center"}
              spacing={1}
              sx={(theme) => ({
                cursor: "pointer",
                // color: isDragActive
                //   ? theme.palette.primary.main
                //   : theme.palette.grey[900],
              })}
            >
              <FileUploadOutlined />
              <Typography variant="h5" fontWeight={700} sx={{}}>
                Browse Files
              </Typography>
            </Stack>
          </Stack>
        )}
        {(localFile || value) && (
          <Box marginTop={1}>
            <SingleFileDisplay
              file={localFile}
              value={value as string}
              onDelete={handleDelete}
              deleteDisabled={deleteDisabled}
            />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box width={"100%"}>
      <Typography fontWeight={600}>{title}</Typography>

      <Stack
        {...getRootProps()}
        marginTop={1}
        padding={2}
        direction={"row"}
        justifyContent={"center"}
        borderRadius={1}
        border={"3px dotted gray"}
        minHeight={"50px"}
        sx={(theme) => ({
          border: isDragActive
            ? `2px dashed ${theme.palette.primary.mainChannel}`
            : `2px dashed ${theme.palette.grey[500]}`,
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? "not-allowed" : "auto",
        })}
      >
        <input {...getInputProps()} />

        <Stack
          direction={"row"}
          justifyContent={"center"}
          spacing={1}
          sx={(theme) => ({
            cursor: "pointer",
            // color: isDragActive
            //   ? theme.palette.primary.main
            //   : theme.palette.grey[900],
          })}
        >
          <FileUploadOutlined />
          <Typography variant="h5" fontWeight={700}>
            Browse Files
          </Typography>
        </Stack>
      </Stack>

      {Array.isArray(value) && (
        <MultiFileDisplay
          value={value}
          onChange={handleMultiChange}
          deleteDisabled={deleteDisabled}
        />
      )}
    </Box>
  );
};

export const SingleFileDisplay: React.FC<{
  file?: File | null;
  value: string | null;
  onDelete?: () => void;
  deleteDisabled?: boolean;
}> = (props) => {
  const { file, value, onDelete, deleteDisabled } = props;
  // const dispatch = useDispatchWrapper();
  const [loading, setLoading] = React.useState(false);

  const handleDownloadFile = async () => {
    if (file) {
      const downloadLink = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = file.name || "download";
      a.click();
      URL.revokeObjectURL(downloadLink);
      return;
    }
    if (!loading) {
      try {
        setLoading(true);
        await downLoadFile(props.value);
      } catch (err) {
        // dispatch(
        //   showMessage({
        //     displayAs: "snackbar",
        //     message: "Someting went to be wrong!",
        //     type: "error",
        //   })
        // );
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePreviewFile = async () => {
    if (file) {
      const downloadLink = URL.createObjectURL(file);
      window.open(downloadLink, "_blank");
      return;
    }
    if (!loading) {
      try {
        setLoading(true);
        await previewFile(props.value);
      } catch (err) {
        // dispatch(
        //   showMessage({
        //     displayAs: "snackbar",
        //     message: "Someting went to be wrong!",
        //     type: "error",
        //   })
        // );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Stack
        direction={"row"}
        sx={{ border: (theme) => "2px solid " + theme.palette.background.neutral }}
        minHeight={"70px"}
        borderRadius={1}
        overflow={"hidden"}
        position={"relative"}
      >
        <Stack
          direction={"row"}
          justifyContent={"center"}
          flex={1}
          alignItems={"center"}
          sx={(theme: Theme) => ({
            background: theme.palette.background.neutral,
            borderLeft: "5px solid " + theme.palette.background.neutral,
          })}
        >
          <InsertDriveFileOutlined fontSize="large" color="action" />
        </Stack>

        <Stack
          flex={2}
          direction={"row"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <Box pl={1}>
            <Typography
              fontWeight={600}
              variant="body1"
              sx={{ wordBreak: "break-all" }}
            >
              {file ? file.name : value ? getFileNameFromUrl(value) : ""}
            </Typography>
          </Box>
          {/* <Typography fontWeight={600}>{file ? file.siz : "Demo"}</Typography> */}
          {loading && (
            <LinearProgress
              color="error"
              sx={{ position: "absolute", bottom: 0, width: "100%" }}
            />
          )}
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"center"}
          flex={1}
          alignItems={"center"}
          spacing={1}
        >
          <Tooltip title="Preview">
            <VisibilityOutlined
              onClick={handlePreviewFile}
              sx={(theme) => ({
                color: theme.palette.grey[600],
                cursor: "pointer",
                opacity: loading ? 0.5 : 1,
              })}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Download
              onClick={handleDownloadFile}
              sx={(theme) => ({
                color: theme.palette.grey[600],
                cursor: "pointer",
                opacity: loading ? 0.5 : 1,
              })}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              onClick={onDelete}
              sx={(theme) => ({
                color: theme.palette.grey[600],
                cursor: "pointer",
                opacity: deleteDisabled ? 0.5 : 1,
              })}
            />
          </Tooltip>
        </Stack>
      </Stack>
    </>
  );
};

export const MultiFileDisplay: React.FC<{
  value: IFileUpload[];
  onChange: (files: IFileUpload[]) => void;
  deleteDisabled?: boolean;
}> = (props) => {
  const { value, onChange, deleteDisabled } = props;
  // const dispatch = useDispatchWrapper();
  const [loading, setLoading] = React.useState<number | null>(null);

  const handleDownloadFile = (row: IFileUpload, index: number) => async () => {
    if (row.file) {
      const downloadLink = URL.createObjectURL(row.file);
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = row.file.name || "download";
      a.click();
      URL.revokeObjectURL(downloadLink);
      return;
    }

    if (!loading && row.path) {
      try {
        setLoading(index);
        await downLoadFile(row.path);
      } catch (err) {
        // dispatch(
        //   showMessage({
        //     displayAs: "snackbar",
        //     message: "Someting went to be wrong!",
        //     type: "error",
        //   })
        // );
      } finally {
        setLoading(null);
      }
    }
  };

  const handlePreviewFile = (row: IFileUpload, index: number) => async () => {
    if (row.file) {
      const downloadLink = URL.createObjectURL(row.file);
      window.open(downloadLink, "_target");
      return;
    }

    if (!loading && row.path) {
      try {
        setLoading(index);
        await previewFile(row.path);
      } catch (err) {
        // dispatch(
        //   showMessage({
        //     displayAs: "snackbar",
        //     message: "Someting went to be wrong!",
        //     type: "error",
        //   })
        // );
      } finally {
        setLoading(null);
      }
    }
  };

  const handleDelete = (rowIndex: number) => () => {
    if (!deleteDisabled) {
      const newValue = produce(value, (draftValues) => {
        draftValues.splice(rowIndex, 1);
      });
      onChange(newValue);
    }
  };

  return (
    <>
      <Stack spacing={1} marginTop={1}>
        {value.map((item, index) => {
          const fileName = item.file
            ? item.file.name
            : item.name || getFileNameFromUrl(item.path || "");
          return (
            <Stack
              direction={"row"}
              border={"1px solid gray"}
              minHeight={"70px"}
              borderRadius={1}
              overflow={"hidden"}
              position={"relative"}
            >
              <Stack
                direction={"row"}
                justifyContent={"center"}
                flex={1}
                alignItems={"center"}
                sx={(theme: Theme) => ({
                  background: theme.palette.grey[100],
                  maxWidth: "17%",
                  borderLeft: "5px solid " + theme.palette.error.main,
                })}
              >
                <InsertDriveFileOutlined fontSize="large" color="action" />
              </Stack>

              <Stack
                flex={2}
                direction={"row"}
                sx={{ background: "#fff" }}
                justifyContent={"start"}
                alignItems={"center"}
                pl={1}
              >
                <Box pl={1}>
                  <Typography
                    fontWeight={600}
                    variant="body1"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {fileName}
                  </Typography>
                </Box>
                {loading !== null && loading === index && (
                  <LinearProgress
                    color="error"
                    sx={{ position: "absolute", bottom: 0, width: "100%" }}
                  />
                )}
                {/* <Typography fontWeight={600}>{file ? file.siz : "Demo"}</Typography> */}
              </Stack>

              <Stack
                direction={"row"}
                justifyContent={"center"}
                flex={1}
                alignItems={"center"}
                spacing={1}
              >
                <Tooltip title="Preview">
                  <VisibilityOutlined
                    onClick={handlePreviewFile(item, index)}
                    sx={(theme) => ({
                      color: theme.palette.grey[600],
                      cursor: "pointer",
                      opacity: loading !== null && loading === index ? 0.5 : 1,
                    })}
                  />
                </Tooltip>
                <Tooltip title="Download">
                  <Download
                    onClick={handleDownloadFile(item, index)}
                    sx={(theme) => ({
                      color: theme.palette.grey[600],
                      cursor: "pointer",
                      opacity: loading !== null && loading === index ? 0.5 : 1,
                    })}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <DeleteOutlined
                    onClick={handleDelete(index)}
                    sx={(theme) => ({
                      color: theme.palette.grey[600],
                      cursor: deleteDisabled ? "not-allowed" : "pointer",
                      opacity: deleteDisabled ? 0.5 : 1,
                    })}
                  />
                </Tooltip>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </>
  );
};
