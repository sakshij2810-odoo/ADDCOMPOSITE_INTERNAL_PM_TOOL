/* eslint-disable import/order */
/* eslint-disable object-shorthand */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-else-return */
/* eslint-disable perfectionist/sort-imports */
import React from "react";
import type { IDataTableV2ColumnsVisibilityProps } from "./DataTableV2ColumnsVisibility.types";
import { Box, Button, Divider, Paper, Popover, Stack, Typography } from "@mui/material";
import { CustomCheckBoxWithLabel } from "../../../formsComponents";
import { ViewWeek } from "@mui/icons-material";
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import { datatableV2FormatText } from "../../helpers/datatableV2FormatText";
import type { IDataTableV2MasterColumn } from "../../interfaces/IDataTableV2Props";

export const DataTableV2ColumnsVisibility: React.FC<
  IDataTableV2ColumnsVisibilityProps
> = (props) => {
  const { columnVisibility, onChange = () => { }, masterColumns } = props;
  const initialColumnVisibility = React.useRef(columnVisibility)

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const canBeOpen = open && Boolean(anchorEl);
  const [columns, setColumns] = React.useState<any>([]);

  const id = canBeOpen ? "data-table-v2-search-transition-popper" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleCheckBox = (field: IDataTableV2MasterColumn, isChecked: boolean) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const data = { ...columnVisibility };
    data[field.fieldName] = !isChecked;

    onChange(data);
  }

  const handleReset = () => {
    onChange(initialColumnVisibility.current);
  }

  return (
    <>
      <Button variant="text" aria-describedby={id} onClick={handleClick}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ViewHeadlineIcon sx={{ color: "#637381", fontSize: 25 }} />
          <Typography
            variant="body1"
            fontSize="1rem"
            fontWeight={600}
            sx={{ color: "#637381" }}
          >
            Columns
          </Typography>
        </Stack>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        sx={{ zIndex: 1200 }}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <>
          <Paper
            variant="outlined"
            sx={{ minWidth: 300, }}
          >
            <Box sx={{ overflow: "auto", maxHeight: 400, p: 1, pl: 1.2, }}>

              {masterColumns.filter(x => x.fieldName).map((data, index) => {
                let isChecked = false;
                if (data.fieldName in columnVisibility) {
                  if (columnVisibility[data.fieldName]) {
                    isChecked = true;
                  } else {
                    isChecked = false;
                  }

                }
                else if (!data.isHidden) {
                  isChecked = true;
                }

                return (
                  <Stack key={index}>
                    <CustomCheckBoxWithLabel
                      label={datatableV2FormatText(data.fieldName)}
                      checked={isChecked}
                      onChange={handleCheckBox(data, isChecked)}
                    />
                  </Stack>
                );
              })}
            </Box>
            <Divider />
            <Stack direction="row" justifyContent="flex-end" p={0.5} pr={1.2}>
              <Button
                variant="text"
                size="large"
                sx={{ fontWeight: 600, fontSize: "1rem" }}

                onClick={handleReset}
              >
                RESET
              </Button>
            </Stack>


          </Paper>
        </>
      </Popover>
    </>
  );
};
