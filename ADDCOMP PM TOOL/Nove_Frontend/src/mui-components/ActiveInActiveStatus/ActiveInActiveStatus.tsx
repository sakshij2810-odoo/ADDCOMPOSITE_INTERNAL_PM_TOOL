import React from "react";
import { CustomChip } from "../CustomChip";

interface IActiveInActiveStatusProps {
  status: string;
}

const capitalizeWords = (str: string) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const StatusRenderer: React.FC<IActiveInActiveStatusProps> = (props) => {
  const status = (props.status || "").toLowerCase();
  if (status === "active") {
    return <CustomChip color="success" content={"Active"} size="small" />;
  } else if (status === "inactive") {
    return (
      <CustomChip
        color="warning"
        content={"Inactive"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else if (status === "closed") {
    return <CustomChip color="error" content={"Closed"} size="small" />;
  } else if (status === "re-opened") {
    return <CustomChip color="info" content={"Re-Opened"} size="small" />;
  } else if (status === "Inactive") {
    return <CustomChip color="error" content={"Inactive"} size="small" />;
  } else if (status === "new submission") {
    return (
      <CustomChip color="success" content={"New Submission"} size="small" />
    );
  } else if (status === "new") {
    return <CustomChip color="success" content={"New"} size="small" />;
  } else if (status === "request for approval") {
    return (
      <CustomChip
        color="warning"
        content={"Request for approval"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else if (status === "request for quote") {
    return (
      <CustomChip color="info" content={"Request for quote"} size="small" />
    );
  } else if (status === "approved") {
    return <CustomChip color="success" content={"Approved"} size="small" />;
  } else if (status === "costing_sheet_requested") {
    return (
      <CustomChip
        color="warning"
        content={"Costing Sheet Requested"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else if (status === "quote received") {
    return <CustomChip color="success" content={"PI"} size="small" />;
  } else if (status === "PI") {
    return (
      <CustomChip
        color="warning"
        content={"PI"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else {
    return (
      <CustomChip
        color="info"
        content={capitalizeWords(status) || "N/A"}
        size="small"
      />
    );
  }
};

export const EnquiryStatusRenderer: React.FC<IActiveInActiveStatusProps> = (
  props,
) => {
  const status = (props.status || "").toLowerCase();
  if (status === "open") {
    return <CustomChip color="success" content={"Open"} size="small" />;
  } else if (status === "request for approval") {
    return (
      <CustomChip
        color="warning"
        content={"Request for approval"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else if (status === "closed") {
    return <CustomChip color="error" content={"Closed"} size="small" />;
  } else if (status === "inactive") {
    return <CustomChip color="info" content={"Inactive"} size="small" />;
  } else if (status === "new") {
    return <CustomChip color="success" content={"New"} size="small" />;
  } else if (status === "order") {
    return <CustomChip color="info" content={"Order"} size="small" />;
  } else if (status === "request_for_quote") {
    return (
      <CustomChip color="info" content={"Request For Quote"} size="small" />
    );
  } else if (status === "request for quote") {
    return (
      <CustomChip color="error" content={"Request for quote"} size="small" />
    );
  } else if (status === "bom") {
    return <CustomChip color="success" content={"Bom"} size="small" />;
  } else if (status === "quote received") {
    return (
      <CustomChip
        color="warning"
        content={"Quote Received"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else if (status === "request_for_approval") {
    return (
      <CustomChip
        color="warning"
        content={"Request For Approval"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else if (status === "New") {
    return (
      <CustomChip
        color="warning"
        content={"New"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else if (status === "quote") {
    return <CustomChip color="success" content={"Quote"} size="small" />;
  } else if (status === "orf_approval_requested") {
    return (
      <CustomChip
        color="warning"
        content={"ORF Approval Requested"}
        size="small"
        sx={{ color: "#000" }}
      />
    );
  } else if (typeof status === "number") {
    return <CustomChip color="success" content={`R${status}`} size="small" />;
  } else if (status === "order_processing") {
    return (
      <CustomChip color="info" content={"Order Processing"} size="small" />
    );
  } else {
    return (
      <CustomChip
        color="info"
        content={capitalizeWords(status) || "N/A"}
        size="small"
      />
    );
  }
};

export const JobStatusRenderer: React.FC<IActiveInActiveStatusProps> = (
  props,
) => {
  const status = (props.status || "").toLowerCase();
  if (status === "approved") {
    return <CustomChip color="success" content={"Approved"} size="small" />;
  } else if (status === "requested") {
    return (
      <CustomChip
        color="warning"
        content={"Requested"}
        sx={{ color: "#000" }}
        size="small"
      />
    );
  } else {
    return <CustomChip color="info" content={status || "N/A"} size="small" />;
  }
};

export const TaskStatusRenderer: React.FC<IActiveInActiveStatusProps> = (
  props,
) => {
  const status = (props.status || "").toLowerCase();
  if (status === "todo") {
    return <CustomChip color="warning" content={"TODO"} size="small" />;
  } else if (status === "progress") {
    return <CustomChip color="info" content={"PROGRESS"} size="small" />;
  } else if (status === "hold") {
    return <CustomChip color="error" content={"HOLD"} size="small" />;
  } else if (status === "completed") {
    return <CustomChip color="success" content={"COMPLETED"} size="small" />;
  } else if (status === "archive") {
    return <CustomChip color="error" content={"ARCHIVE"} size="small" />;
  } else if (status === "high") {
    return <CustomChip color="error" content={"High"} size="small" />;
  } else if (status === "medium") {
    return <CustomChip color="warning" content={"MEDIUM"} size="small" />;
  } else if (status === "low") {
    return <CustomChip color="info" content={"LOW"} size="small" />;
  } else {
    return (
      <CustomChip
        color="info"
        content={capitalizeWords(status) || "N/A"}
        size="small"
      />
    );
  }
};
