import React, { useEffect, useState } from "react";
import { Box, Button, LinearProgress } from "@mui/material";
import { Dialog } from "../../Dialogs/Dialog";

import { Clear } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { IEmailDocument, IEnquiryAttachmentsDialog } from "../ComposeMail.types";
import { ILoadState, IStoreState, useAppDispatch } from "src/redux";
import { IData, IDataTableProps, MobileLogoRenderType, RenderType } from "src/mui-components/TableV1/interfaces/IDataTableProps";
import { DataTable } from "src/mui-components/TableV1/DataTable";


export const EnquiryAttachmentsDialog: React.FC<IEnquiryAttachmentsDialog> = ({
  open,
  enquiryNumber,
  onClose,
  onUploadSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { data: enquiryAttachments, loading } = useSelector(
    (storeState: IStoreState) => storeState.leads.leads.private_leads_list,
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<IEmailDocument[]>([]);

  useEffect(() => {
    // const newFiles = enquiryAttachments.map((file) => ({
    //   ...file,
    //   selected: false,
    // }));
    // setSelectedFiles(newFiles);
  }, [enquiryAttachments]);

  useEffect(() => {
    // dispatch(fetchEnquiryDocumentsListAsync(enquiryNumber, 1, 10));
  }, [enquiryNumber]);

  const onFileSelectClick = (row: IEmailDocument) => {
    let enquiryFiles = [...selectedFiles];
    const selectedIndex = enquiryFiles.findIndex(
      (file) => file.enquiry_attachment_uuid === row.enquiry_attachment_uuid,
    );
    enquiryFiles[selectedIndex].selected = true;
    setSelectedFiles(enquiryFiles);
  };

  const onFileUnSelectClick = (row: IEmailDocument) => {
    let enquiryFiles = [...selectedFiles];
    const selectedIndex = enquiryFiles.findIndex(
      (file) => file.enquiry_attachment_uuid === row.enquiry_attachment_uuid,
    );
    enquiryFiles[selectedIndex].selected = false;
    setSelectedFiles(enquiryFiles);
  };

  const handleUploadClick = async () => {
    // setUploadLoading(true);
    // let selectedDocs = [...selectedFiles].filter((file) => file.selected);
    // fetchEnquiryFileInMailFormat(selectedDocs).then((data) => {
    //   onUploadSuccess(selectedDocs);
    //   onClose();
    //   setUploadLoading(false);
    // });

    let selectedDocs = [...selectedFiles]
      .filter((file) => file.selected)
      .map((file) => file.file_url);
    onUploadSuccess(selectedDocs);
    onClose();
  };

  const enquiryAttachmentsProps: IDataTableProps = {
    selectionMode: "none",
    isDataLoading: loading !== ILoadState.succeeded,
    uniqueRowKeyName: "id",
    tableCommandBarProps: {
      leftItems: {},
      rightItems: {},
    },
    mobileLogo: {
      type: MobileLogoRenderType.reactNode,
    },
    columns: [
      {
        key: "document_type",
        headerName: "Document Type",
        fieldName: "document_type",
        renderType: RenderType.TEXT,
      },
      {
        key: "description",
        headerName: "Description",
        fieldName: "description",
        renderType: RenderType.TEXT,
      },
      {
        key: "insert_ts",
        headerName: "Date",
        fieldName: "insert_ts",
        renderType: RenderType.DATE_DARK_COLOR,
      },
      {
        key: "actions",
        headerName: "Actions",
        fieldName: "",
        onRowCellRender: (value: IData, row: IEmailDocument) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              disabled={row.selected}
              onClick={() => onFileSelectClick(row)}
            >
              {`Select${row.selected ? "ed" : ""}`}
            </Button>
            {row.selected && (
              <Clear
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={() => onFileUnSelectClick(row)}
              />
            )}
          </Box>
        ),
        renderType: RenderType.TEXT,
      },
    ],
    items: selectedFiles,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Enquiry Documents"
      size="md"
      contentSx={{
        pointerEvents: uploadLoading ? "none" : "auto",
      }}
      actions={[
        {
          label: "Upload",
          type: "button",
          variant: "contained",
          disabled:
            uploadLoading ||
            selectedFiles.filter((file) => file.selected).length === 0,
          onClick: handleUploadClick,
        },
      ]}
    >
      <DataTable {...enquiryAttachmentsProps} />
      {uploadLoading && <LinearProgress />}
    </Dialog>
  );
};
