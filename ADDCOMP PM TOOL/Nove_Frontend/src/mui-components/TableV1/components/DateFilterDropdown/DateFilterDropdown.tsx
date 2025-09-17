import React from "react";

import { ControlledCustomSelect } from "../../../formsComponents";

import type { IDateFilterDropdownProps } from "./interfaces/IDateFilterDropdownProps";

export const DateFilterDropdown: React.FC<IDateFilterDropdownProps> = (
  props
) => {
  const { value, options, sx, onChange, excludeOptions, placeholder } = props;

  return (
    <ControlledCustomSelect
      sx={{ minWidth: "120px", ...sx }}
      value={value}
      placeholder={placeholder}
      displayEmpty
      onChange={onChange}
      options={options.filter(x => !(excludeOptions && excludeOptions.includes(x.value as any))).map((option) => {
        return (
          { label: option.label, value: option.value }
        );
      })}
    />
  );
};
