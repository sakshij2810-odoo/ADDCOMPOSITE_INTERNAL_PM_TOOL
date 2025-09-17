/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
import React from "react";
import type {
  IDataTableV2DateSearchFilterProps,
  IDatatableV2AdvancedSearchFilter,
} from "./SearchFilter.types";
import { generateDataTableV2ColDefs } from "../../helpers/generateDataTableV2ColDefs";
import type {
  SelectChangeEvent
} from "@mui/material";
import {
  Badge,
  Button,
  Grid,
  Paper,
  Popover,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Add,
  Close,
  DeleteForever,
  FilterList,
  Search,
} from "@mui/icons-material";
import {
  ControlledCustomSelect,
  CustomFormLabel,
  CustomSwitch,
  CustomTextField,
} from "../../../formsComponents";
import { produce } from "immer";
import { isEqual } from "lodash";

const operatorsList = [
  { label: "Equal", value: "EQUAL" },
  { label: "Not Equal", value: "NOT_EQUAL" },
  { label: "Greather", value: "GREATER" },
  { label: "Lesser", value: "LESSER" },
  { label: "Greater than equal", value: "GREATER_THAN_EQUAL" },
  { label: "Less than equal", value: "LESSER_THAN_EQUAL" },
  { label: "Contains", value: "CONTAINS" },
  { label: "Starts with", value: "STARTS_WITH" },
  { label: "Ends with", value: "ENDS_WITH" },
];

// const filterConditions = (data: IDatatableV2AdvancedSearchFilter) => {
//   return data.filter((x) => x.value !== "" && x.operator);
// };

export const DataTableV2SearchFilter: React.FC<
  IDataTableV2DateSearchFilterProps
> = (props) => {
  const {
    state,
    masterColumns,
    onChange = () => { },
    excludeColumnsInSearch = [],
    additionalColumns = [],
    loadInitialFilterOncePopoverOpened,
    showMyRecordsButton,
  } = props;
  const theme = useTheme();
  const [searchFilterState, setSearchFilterState] = React.useState(state || []);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const canBeOpen = open && Boolean(anchorEl);
  const [columns, setColumns] = React.useState<any>([]);
  const isShowAllChecked =
    showMyRecordsButton &&
    state.length > 0 &&
    state[0].column.includes(showMyRecordsButton.columnName);

  const id = canBeOpen ? "data-table-v2-search-transition-popper" : undefined;

  const executeSearch = (
    newState: IDatatableV2AdvancedSearchFilter,
    prevntDialogToggle?: boolean
  ) => {
    if (!isEqual(state, newState)) {
      onChange(newState);
      if (!prevntDialogToggle) {
        setOpen((previousOpen) => !previousOpen);
      }
    }
  };

  const handleSearch = () => {
    executeSearch(searchFilterState);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    const newOpen = !open;
    if (newOpen) {
      let initialColumns: IDatatableV2AdvancedSearchFilter = [];
      if (loadInitialFilterOncePopoverOpened && state.length === 0) {
        initialColumns = loadInitialFilterOncePopoverOpened;
      } else {
        initialColumns = [
          {
            column: [],
            value: "",
            logicalOperator: "OR",
            operator: "contains",
          },
        ];
      }
      setSearchFilterState(state.length > 0 ? state : initialColumns);
    } else {
      setSearchFilterState([]);
    }
    setOpen((previousOpen) => !previousOpen);
  };

  const handleTextChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const newState = produce(searchFilterState, (draftState) => {
        draftState[index].value = value;
      });

      setSearchFilterState(newState);

      // onChange(filterConditions(newState));
    };

  const handleColumnChangeChange =
    (index: number) => (e: SelectChangeEvent<unknown>) => {
      const newState = produce(searchFilterState, (draftState) => {
        draftState[index].column = e.target.value as string[];
        draftState[index].value = "";
      });

      setSearchFilterState(newState);
      // onChange(newState);
    };

  const handleOeprator = (index: number) => (e: SelectChangeEvent<unknown>) => {
    const newState = produce(searchFilterState, (draftState) => {
      draftState[index].operator = e.target.value as string;
      // draftState[index].value = "";
    });

    setSearchFilterState(newState);

    // executeSearch(filterConditions(newState));

  };

  const handleAdd = () => {
    const newState = produce(searchFilterState, (draftState) => {
      draftState.push({
        column: [],
        value: "",
        logicalOperator: "AND",
        operator: "contains",
      });
    });
    setSearchFilterState(newState);
  };

  const handleRemove = (index: number) => () => {
    if (index < 1) {
      setSearchFilterState([]);
      onChange([]);
      setOpen(false);
    } else {
      const finaldata = [...searchFilterState];
      finaldata.splice(index, 1);
      setSearchFilterState(finaldata);

      // executeSearch(filterConditions(finaldata));
    }
  };

  const handleShowMyRecords = () => {
    if (showMyRecordsButton) {
      if (isShowAllChecked) {
        let initialColumns: IDatatableV2AdvancedSearchFilter = [];

        initialColumns = [
          {
            column: [],
            value: "",
            logicalOperator: "OR",
            operator: "contains",
          },
        ];

        executeSearch([], true);

        return;

      }
      executeSearch(
        [
          ...state,
          {
            column: [showMyRecordsButton.columnName],
            operator: "EQUAL",
            logicalOperator: "AND",
            value: showMyRecordsButton.currentUserId,
          },
        ],
        true
      );
    }
  };

  React.useEffect(() => {
    let columnsList = [
      ...generateDataTableV2ColDefs(masterColumns, excludeColumnsInSearch),
    ];
    for (const column of additionalColumns) {
      if (column.placementIndex !== undefined) {
        columnsList.splice(column.placementIndex, 0, column);
      } else {
        columnsList.push(column);
      }
    }
    setColumns(columnsList);
  }, [masterColumns]);
  const isMutpileFilters = searchFilterState.length > 1;

  return (
    <Badge badgeContent={state.length} color="primary">
      <Button variant="text" aria-describedby={id} onClick={handleClick}>
        <Stack direction="row" spacing={1} alignItems="center">
          <FilterList sx={{ color: "#637381", fontSize: 25 }} />
          <Typography
            variant="body1"
            fontSize="1rem"
            fontWeight={600}
            // color="primary.main"
            sx={{ color: "#637381" }}
          >
            Search Filter
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
        <Paper
          variant="outlined"
          sx={{ minWidth: 750, p: 1, overflow: "auto" }}
        >
          {showMyRecordsButton && (
            <>
              <Stack direction="row" spacing={0} alignItems="center">
                <CustomSwitch
                  checked={isShowAllChecked}
                  onClick={handleShowMyRecords}
                />
                <Typography variant="h4" color="primary" fontWeight={600}>
                  Show My Records
                </Typography>
              </Stack>
              {isShowAllChecked && (
                <Stack direction="row" justifyContent="center">
                  <Typography
                    variant="body1"
                    fontSize="1rem"
                    sx={{
                      color: theme.palette.grey[600],
                    }}
                    width="85%"
                    textAlign="center"
                    fontWeight={500}
                  >
                    {` Currently displaying only your records. To apply
                    additional filters, turn off 'Show My Records'`}
                  </Typography>
                </Stack>
              )}
            </>
          )}
          {!isShowAllChecked && (
            <>
              {searchFilterState.map((data, index) => {
                return (
                  <Stack mb={1} key={index}>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={1}
                        display="flex"
                        alignItems="end"
                        justifyContent="center"
                      >
                        <Close
                          fontSize="medium"
                          onClick={handleRemove(index)}
                          sx={{ cursor: "pointer", mb: 1 }}
                        />
                      </Grid>

                      {isMutpileFilters && index > 0 && (
                        <Grid
                          item
                          xs={1.5}
                          display="flex"
                          alignItems="end"
                        >
                          <ControlledCustomSelect
                            fullWidth
                            value={data.logicalOperator}
                            disabled
                            options={[
                              { label: "AND", value: "AND" },
                              { label: "OR", value: "OR" },
                            ]}
                          />
                        </Grid>
                      )}
                      {isMutpileFilters && index === 0 && (
                        <Grid item xs={1.5} />
                      )}

                      <Grid item xs={isMutpileFilters ? 4.5 : 5}>
                        <CustomFormLabel sx={{ mt: 0 }}>
                          Columns
                        </CustomFormLabel>
                        <ControlledCustomSelect
                          multiple
                          fullWidth
                          value={data.column}
                          options={columns}
                          displayEmpty
                          placeholder="Select Column"
                          onChange={handleColumnChangeChange(index)}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 400,
                                overflowY: "auto",
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={isMutpileFilters ? 2 : 2.5}>
                        <CustomFormLabel sx={{ mt: 0 }}>
                          Operator
                        </CustomFormLabel>

                        <ControlledCustomSelect
                          fullWidth
                          value={data.operator}
                          options={operatorsList}
                          onChange={handleOeprator(index)}
                          placeholder="Select Column"
                        />
                      </Grid>
                      <Grid item xs={isMutpileFilters ? 3 : 3.5}>
                        <CustomFormLabel sx={{ mt: 0 }}>
                          Value
                        </CustomFormLabel>
                        <CustomTextField
                          fullWidth
                          value={data.value}
                          placeholder="Enter value"
                          onChange={handleTextChange(index)}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                );
              })}

              <Stack direction="row" justifyContent="end">
                {/* {showMyRecordsButton && (
                <DataTableV2FilterButton
                  icon={Assignment}
                  id="assign-to-me"
                  label="Show My Records"
                  onClick={handleShowMyRecords}
                />
              )} */}
                <Button
                  variant="contained"
                  sx={{ fontWeight: 600, fontSize: "1rem" }}
                  startIcon={<Search fontSize="medium" />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                mt={1}
              >
                <Button
                  variant="text"
                  sx={{ fontWeight: 600, fontSize: "1rem" }}
                  startIcon={<Add fontSize="medium" />}
                  onClick={handleAdd}
                >
                  ADD FILTER
                </Button>
                <Button
                  variant="text"
                  sx={{ fontWeight: 600, fontSize: "1rem" }}
                  startIcon={<DeleteForever fontSize="medium" />}
                  onClick={handleRemove(-1)}
                >
                  REMOVE ALL
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Popover>
    </Badge>
  );
};
