/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { IRecordPremissionsRightPanelProps } from "./RecordPremissionsRightPanel.types";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  useTheme,
} from "@mui/material";
import { Add, Close, Remove, Save } from "@mui/icons-material";
import { fetchRecordDropdownWithArgsAsync, IRecordColumnRelation, IRecordFilterValue, useAppDispatch } from "src/redux";
import { MuiRightPanel } from "src/mui-components/RightPanel";
import { ISelectOption } from "src/types/common";
import { MuiFormFields } from "src/mui-components";
import { produce } from "immer";

export const RecordPremissionsRightPanel: React.FC<
  IRecordPremissionsRightPanelProps
> = (props) => {
  const { open, module, onClose } = props;

  const [state, setState] = React.useState(module);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [columns, setColumns] = React.useState<IRecordColumnRelation[]>([]);
  const dispatch = useAppDispatch();

  const handleAddPremission = () => {
    const currentIndex = columns.length;
    const newColumn = state.column_relation_options[currentIndex];
    const finalColumns = [...columns, newColumn];
    setColumns(finalColumns);
  };

  const handleRemovePremission = () => {
    const finalColumns = [...columns];
    const record = finalColumns.pop();
    if (record) {
      const newState = produce(state, (draftState: any) => {
        const keys = Object.keys(draftState.filter_values);
        if (keys.length > 0) {
          delete draftState.filter_values[keys[0]][record.column_key];
        }
      });
      setState(newState);
      setColumns(finalColumns);
    }
  };

  const handleFilterValues = (columnKey: string, selectedValues: any[]) => {
    let finalValues = [...selectedValues];
    if (finalValues.includes("*")) {
      finalValues = ["*"];
    }
    const newState = produce(state, (draftstate: any) => {
      const selectedModule = state;
      if (
        selectedModule.filter_values &&
        Object.keys(selectedModule.filter_values).length > 0
      ) {
        const key = Object.keys(selectedModule.filter_values)[0];
        draftstate.filter_values[key][columnKey] = finalValues;
      } else {
        draftstate.filter_values = {
          or: {
            [columnKey]: finalValues,
          },
        };
      }
    });

    setState(newState);
  };

  const handleFilterKeyChange = (newKey: string) => {
    const newState = produce(state, (draftstate: any) => {
      const selectedModule = state;

      if (
        selectedModule.filter_values &&
        Object.keys(selectedModule.filter_values).length > 0
      ) {
        const key = Object.keys(selectedModule.filter_values)[0];
        draftstate.filter_values = {
          [newKey]: selectedModule.filter_values[key],
        };
      } else {
        draftstate.filter_values = {
          [newKey]: {},
        };
      }
    });

    setState(newState);
  };

  const handleClose = () => {
    onClose();
  };
  const handleSave = () => {
    props.onSave(state);
  };

  React.useEffect(() => {
    const keys = Object.keys(state.filter_values || {});
    if (keys.length > 0) {
      const listKeys = Object.keys(state.filter_values[keys[0]]);
      if (listKeys.length > 0) {
        const tempColumns: IRecordColumnRelation[] = [];
        for (let col of state.column_relation_options) {
          if (listKeys.includes(col.column_key)) {
            tempColumns.push(col);
          }
        }
        setColumns(tempColumns);
      }
    }
  }, []);

  return (
    <>
      <MuiRightPanel
        open={open}
        heading={state.submodule_name}
        onClose={onClose}
        width="40%"
        actionButtons={
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                type="button"
                disabled={saveLoading}
                fullWidth
                onClick={handleClose}
              >
                Close
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                disabled={saveLoading}
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        }
      >
        <>
          <Grid container>
            <Grid item xs={12} md={8}>
              <OperationSelect
                filterValues={state.filter_values || {}}
                onFilterValueChange={handleFilterKeyChange}
              />
            </Grid>
            <Grid item xs={12} md={4} />
          </Grid>
          <Grid container marginTop={5}>
            <Grid item xs={12} md={12}>
              <Stack spacing={1} direction={"row"} justifyContent={"end"}>
                <Button
                  color="error"
                  variant="contained"
                  disabled={columns.length === 0}
                  onClick={handleRemovePremission}
                >
                  <Remove fontSize="small" />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    columns.length === state.column_relation_options.length
                  }
                  onClick={handleAddPremission}
                >
                  <Add fontSize="small" />
                </Button>
              </Stack>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "100px" }}>On</TableCell>
                      <TableCell align="center">Allow</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {columns.map((column) => {
                      const key = Object.keys(state.filter_values || {})[0];
                      return (
                        <Row
                          key={column.field}
                          column={column}
                          filterKey={key}
                          filterValues={state.filter_values}
                          onFilterValueChange={handleFilterValues}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </>
      </MuiRightPanel>
    </>
  );
};

const Row: React.FC<{
  column: IRecordColumnRelation;
  filterKey: string;
  filterValues: IRecordFilterValue;
  onFilterValueChange: (columnKey: string, selectedValues: any) => void;
}> = (props) => {
  const { column, filterValues, filterKey, onFilterValueChange } = props;
  const [options, setOptions] = React.useState<ISelectOption[]>([]);

  const selectedValues =
    filterKey && filterValues
      ? filterValues[filterKey][column.column_key] || []
      : [];
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const values = e.target.value as string[];
    onFilterValueChange(column.column_key, values);
  };

  // const handleDelete = (value: any) => (e: any)=>{
  //   e.stopPropagation();
  //   e.preventDefault();
  //    const finalSelectedValues = [...selectedValues];
  //    const index = selectedValues.indexOf(value);
  //    if(index > -1){
  //     finalSelectedValues.splice(index, 1);
  //     onFilterValueChange(column.column_key, finalSelectedValues);
  //    }
  // }

  React.useEffect(() => {
    dispatch(
      fetchRecordDropdownWithArgsAsync({
        apiUrl: column.api,
        columnKey: column.column_key,
        columnLabel: column.field,
        onCallback(isSuccess, data) {
          if (isSuccess) {
            setOptions(data);
          }
        },
      }),
    );
  }, []);

  return (
    <TableRow>
      <TableCell sx={{ textTransform: "capitalize" }}>
        {column.column_label}
      </TableCell>
      <TableCell>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          fullWidth
          value={selectedValues}
          variant="outlined"
          sx={{
            ".MuiOutlinedInput-input": {
              paddingTop: "5px",
              paddingBottom: "5px",
              fontSize: "0.8rem",

              color: "rgb(38, 38, 38)",
            },
          }}
          onChange={handleSelectChange}
          input={<OutlinedInput id="select-multiple-chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={getLabelFromValue(value, options)}

                // onDelete={handleDelete(value)}
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {(column.column_label === "User"
            ? options.filter((item) => item.value !== "self_zone")
            : options
          ).map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              style={getStyles(item.value, ["a"], theme)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
    </TableRow>
  );
};

export const OperationSelect: React.FC<{
  filterValues: IRecordFilterValue;
  onFilterValueChange: (type: string) => void;
}> = (props) => {
  const keys = Object.keys(props.filterValues);
  const finalKey = keys.length > 0 ? keys[0] : null;

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as string;
    props.onFilterValueChange(value);
  };

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      marginTop={3}
      spacing={3}
    >
      <MuiFormFields.MuiSelect
        name=""
        label="Type"
        value={finalKey}
        onChange={handleChange}
        placeholder="Select one"
        options={[
          { label: "AND", value: "and" },
          { label: "OR", value: "or" },
        ]}
      />
    </Stack>
  );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: any, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const getLabelFromValue = (value: any, options: ISelectOption[]) => {
  if (Array.isArray(value)) {
    return value;
  }
  const option = options.find((option) => option.value === value);
  return option ? option.label : "";
};
