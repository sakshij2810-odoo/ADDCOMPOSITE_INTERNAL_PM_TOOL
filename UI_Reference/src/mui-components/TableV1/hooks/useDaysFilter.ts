/* eslint-disable no-unneeded-ternary */
import type { SelectChangeEvent } from "@mui/material";

import React from "react";

export interface IFilteredDays {
  fromDate: string;
  toDate: string;
}

export const useDaysFilter = ({
  defaultValue,
  daysList,
}: {
  defaultValue?: string | null;
  daysList: {
    label: string;
    value: string;
    fromDate: string;
    toDate: string;
  }[];
}) => {
  const [selectedValue, setSelectedValue] =
    React.useState<string>(defaultValue ? defaultValue : "");
  const [filteredDays, setFilteredDays] = React.useState<IFilteredDays | null>(
    null
  );

  const handleDaySelectChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as string;
    const data = daysList.find((x) => x.value === value);
    if (data && value !== "") {
      setFilteredDays({ fromDate: data.fromDate, toDate: data.toDate });
    } else {
      setFilteredDays(null);
    }
    setSelectedValue(value);
  };

  const resetDaysSelect =() => {
    setSelectedValue("");
  }

  return {
    selectedDayValue: selectedValue,
    daysList: [{label: "Reset", value: ""},...daysList],
    filteredDays,
    resetDaysSelect,
    handleDaySelectChange,
  };
};
