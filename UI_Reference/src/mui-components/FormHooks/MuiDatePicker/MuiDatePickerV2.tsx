import React, { useState, useEffect } from "react";
import {
  TextField,
  Popover,
  MenuItem,
  Box,
  Grid,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export type IMuiDatePickerProps = {
  label?: string;
  error?: string;
  onChange?: (value: string | null) => void;
  value: string | null; // always ISO string in/out
};

export const MuiDatePickerV2: React.FC<IMuiDatePickerProps> = ({
  label,
  error,
  onChange,
  value,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [date, setDate] = useState({ month: "", day: "", year: "" });

  const open = Boolean(anchorEl);

  // Parse ISO → internal state
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setDate({
          month: String(d.getMonth() + 1),
          day: String(d.getDate()),
          year: String(d.getFullYear()),
        });
      }
    }
  }, [value]);

  // Format for input field
  const formattedDate =
    date.month && date.day && date.year
      ? `${date.month.padStart(2, "0")}/${date.day.padStart(2, "0")}/${date.year}`
      : "";

  // Update ISO when dropdown changes
  const updateDate = (field: keyof typeof date, newValue: string) => {
    const updated = { ...date, [field]: newValue };
    setDate(updated);

    if (updated.month && updated.day && updated.year) {
      const iso = new Date(
        Number(updated.year),
        Number(updated.month) - 1,
        Number(updated.day)
      ).toISOString();
      onChange?.(iso);
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <TextField
        label={label}
        value={formattedDate}
        size="small"
        error={!!error}
        helperText={error}
        fullWidth
        InputProps={{
          readOnly: true,
          // endAdornment: (
          //   <InputAdornment position="end">
          //     <IconButton onClick={handleOpen}>
          //       <CalendarTodayIcon />
          //     </IconButton>
          //   </InputAdornment>
          // ),
        }}
        onClick={handleOpen}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box p={2} minWidth={280}>
          <Typography variant="subtitle2" gutterBottom>
            Select Date
          </Typography>
          <Grid container spacing={1}>
            {/* Month Dropdown */}
            <Grid item xs={4}>
              <TextField
                size="small"
                select
                label="Month"
                fullWidth
                value={date.month}
                onChange={(e) => updateDate("month", e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Day Dropdown */}
            <Grid item xs={4}>
              <TextField
                select
                size="small"
                label="Day"
                fullWidth
                value={date.day}
                onChange={(e) => updateDate("day", e.target.value)}
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <MenuItem key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Year Dropdown */}
            <Grid item xs={4}>
              <TextField
                select
                size="small"
                label="Year"
                fullWidth
                value={date.year}
                onChange={(e) => updateDate("year", e.target.value)}
                sx={{
                  "& .MuiSelect-select": {
                    paddingRight: "8px !important", // reduce right padding
                    paddingLeft: "12px",            // optional: adjust left padding
                    minWidth: "80px",               // ensures enough room for "2025"
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: { maxHeight: 300 },
                    },
                  },
                }}
              >
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <MenuItem key={year} value={String(year)}>
                      {year}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </div>
  );
};
