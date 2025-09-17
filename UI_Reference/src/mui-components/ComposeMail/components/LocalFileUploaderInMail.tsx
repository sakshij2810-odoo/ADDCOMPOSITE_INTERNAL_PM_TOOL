import { Computer, Delete, InsertDriveFile } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  FileUploadWithListProps,
  IEmailAttachment,
} from "../ComposeMail.types";
import { convertFileToBase64Async } from "../ComposeMail.helpers";
import axios_base_api from "src/utils/axios-base-api";

export const LocalFileUploaderInMail: React.FC<FileUploadWithListProps> = (
  props,
) => {
  const { onUploadSuccess, label = "upload files", asPayload } = props;
  const [localAttachments, setLocalAttachments] = useState<IEmailAttachment[]>(
    [],
  );
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement> | undefined,
  ) => {
    if (event?.target.files && event?.target.files?.length > 0) {
      setUploadLoading(true);
      const filesArray = Array.from(event.target.files);
      let newArray = [];
      for (let i = 0; i < filesArray.length; i++) {
        const fileData = await convertFileToBase64Async(filesArray[i]);
        newArray.push({
          content: fileData,
          filename: filesArray[i].name as string,
        });
      }
      const localKeys = newArray.map((file) => file.content);
      const localFileNameKeys = newArray.map((file) => file.filename);
      const localBufferJson = await axios_base_api.post("/general/base64-to-buffer", {
        base64Array: localKeys,
      });
      const localFiles =
        localBufferJson?.data?.data?.map(
          (ele: any, index: number): IEmailAttachment => ({
            content: ele.data,
            filename: localFileNameKeys[index].split("/").at(-1) || "",
            as_payload: asPayload,
          }),
        ) || ([] as IEmailAttachment[]);
      setLocalAttachments(localFiles);
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    onUploadSuccess(localAttachments);
  }, [localAttachments]);

  const handleDelete = (filename: string) => {
    setLocalAttachments((preFiles) =>
      preFiles.filter((file) => file.filename !== filename),
    );
  };

  return (
    <>
      <Box>
        <input
          type="file"
          style={{ display: "none" }}
          id="file-upload-input"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload-input">
          <Button
            fullWidth
            component="span"
            variant="contained"
            disabled={uploadLoading}
            startIcon={<Computer />}
          >
            {label}
          </Button>
        </label>
      </Box>
      <Box>
        {localAttachments.map((file) => (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid #ccc"
            paddingY={1}
          >
            {/* File Icon */}
            <Box display="flex" alignItems="center">
              <InsertDriveFile sx={{ marginRight: 1 }} />
              {/* File Name */}
              <Typography variant="body1" sx={{ marginRight: 1 }}>
                {file.filename}
              </Typography>
            </Box>

            {/* Delete Button */}
            <IconButton onClick={() => handleDelete(file.filename)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
      </Box>
    </>
  );
};
