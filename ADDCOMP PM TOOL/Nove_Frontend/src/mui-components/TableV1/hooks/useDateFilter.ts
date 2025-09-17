/* eslint-disable @typescript-eslint/no-shadow */
import type { SelectChangeEvent } from "@mui/material";

import React from "react";

import { dateFilterDates } from "../helpers";

export type DateTypes =
  | "today"
  | "yesterday"
  | "lastWeek"
  | "thisWeek"
  | "thisMonth"
  | "last28Days"
  | "last90Days"
  | "allTimes"
  | "custom";

export interface IDate {
  fromDate: string;
  toDate: string;
}

export const useDateFilter = ({
  format,
  defaultType = "today",
}: {
  format?: string;
  defaultType?: DateTypes;
}) => {
  const {
    today,
    tommorow,
    lastweek,
    startDateOfMonth,
    last28Days,
    last90Days,
    yesterday,
    thisWeekStartDate,
    thisWeekEndDate,
    allTimesStartDate
  } = dateFilterDates(format);
  const [date, setDate] = React.useState({
    ...getInitialDate(defaultType, format),
  });
  const [type, setType] = React.useState(defaultType);

  const updateDate = (type: DateTypes) => {
    if (type === "today") {
      setDate({ fromDate: today, toDate: tommorow });
    } else if (type === "yesterday") {
      setDate({ fromDate: yesterday, toDate: yesterday });
    } else if (type === "lastWeek") {
      setDate({ fromDate: lastweek, toDate: today });
    } else if (type === "thisMonth") {
      setDate({ fromDate: startDateOfMonth, toDate: today });
    } else if (type === "last28Days") {
      setDate({ fromDate: last28Days, toDate: today });
    } else if (type === "last90Days") {
      setDate({ fromDate: last90Days, toDate: today });
    } else if (type === "thisWeek") {
      setDate({ fromDate: thisWeekStartDate, toDate: thisWeekEndDate });
    }
    else if (type === "allTimes") {
      setDate({ fromDate: allTimesStartDate, toDate: today });
    }
    setType(type as DateTypes);
  };

  const handleDateSelectChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as DateTypes;
    updateDate(value);
  };

  const dateDropdownList = React.useMemo(() => {
    return [
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "yesterday" },
      { label: "Last Week", value: "lastWeek" },
      { label: "This Week", value: "thisWeek" },
      { label: "This Month", value: "thisMonth" },
      { label: "Last 28 Days", value: "last28Days" },
      { label: "Last 90 Days", value: "last90Days" },
      { label: "All Times", value: "allTimes" },
      { label: "Customize", value: "custom" },
    ];
  }, []);

  return {
    date,
    setDate,
    type,
    handleDateSelectChange,
    updateDate,
    dateDropdownList,
  };
};

const getInitialDate = (type: DateTypes, format?: string) => {
  const {
    today,
    tommorow,
    lastweek,
    startDateOfMonth,
    yesterday,
    last28Days,
    last90Days,
    thisWeekStartDate,
    thisWeekEndDate,
    allTimesStartDate,
  } = dateFilterDates(format);
  if (type === "yesterday") {
    return { fromDate: yesterday, toDate: yesterday };
  } if (type === "lastWeek") {
    return { fromDate: lastweek, toDate: today };
  } if (type === "thisMonth") {
    return { fromDate: startDateOfMonth, toDate: today };
  } if (type === "last28Days") {
    return { fromDate: last28Days, toDate: today };
  } if (type === "last90Days") {
    return { fromDate: last90Days, toDate: today };
  } if (type === "thisWeek") {
    return { fromDate: thisWeekStartDate, toDate: thisWeekEndDate };
  }
  if (type === "allTimes") {
    return { fromDate: allTimesStartDate, toDate: today };
  }
  return { fromDate: today, toDate: tommorow };
};
