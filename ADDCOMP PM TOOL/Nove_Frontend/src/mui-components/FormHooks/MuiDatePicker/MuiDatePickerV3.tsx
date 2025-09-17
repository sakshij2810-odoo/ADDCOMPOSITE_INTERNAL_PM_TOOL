import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export type IMuiDatePickerProps = {
  label: string;
  error?: string;
  onChange?: (value: string) => void;
  value: string; // ISO in/out
};

const pad2 = (n: number | string) => String(n).padStart(2, "0");
const onlyDigits = (s: string) => s.replace(/\D/g, "");
const formatMask = (digits: string) => {
  const d = digits.slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
};
const daysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();
const isValidMDY = (mm: string, dd: string, yyyy: string) => {
  const m = Number(mm), d = Number(dd), y = Number(yyyy);
  if (!(m >= 1 && m <= 12)) return false;
  if (!(y >= 1 && yyyy.length === 4)) return false;
  const dim = daysInMonth(m, y);
  return d >= 1 && d <= dim;
};

export const MuiDatePickerV3: React.FC<IMuiDatePickerProps> = ({
  label,
  error,
  onChange,
  value,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [date, setDate] = useState({ month: "", day: "", year: "" });
  const [inputValue, setInputValue] = useState("");
  const [formatError, setFormatError] = useState<string | null>(null);

  const open = Boolean(anchorEl);

  // Parse ISO -> state (use UTC getters to avoid TZ date-shift)
  useEffect(() => {
    if (!value) {
      setDate({ month: "", day: "", year: "" });
      setInputValue("");
      setFormatError(null);
      return;
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    const mm = pad2(d.getUTCMonth() + 1);
    const dd = pad2(d.getUTCDate());
    const yyyy = String(d.getUTCFullYear());
    setDate({ month: mm, day: dd, year: yyyy });
    setInputValue(`${mm}/${dd}/${yyyy}`);
    setFormatError(null);
  }, [value]);

  const helperText = useMemo(
    () => formatError ?? error ?? "",
    [formatError, error]
  );
  const hasError = Boolean(formatError || error);

  // Emit ISO (UTC midnight)
  const emitISO = (mm: string, dd: string, yyyy: string) => {
    if (!isValidMDY(mm, dd, yyyy)) return;
    const iso = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd))).toISOString();
    onChange?.(iso);
  };

  // Dropdown updates
  const updateDate = (field: keyof typeof date, newValue: string) => {
    const updated = { ...date, [field]: pad2(newValue) };
    // Clamp day if month/year changed
    if ((field === "month" || field === "year") && updated.month && updated.year && updated.day) {
      const dim = daysInMonth(Number(updated.month), Number(updated.year));
      if (Number(updated.day) > dim) updated.day = pad2(dim);
    }
    setDate(updated);

    const masked =
      updated.month && updated.day && updated.year
        ? `${pad2(updated.month)}/${pad2(updated.day)}/${updated.year}`
        : formatMask(onlyDigits(inputValue));
    setInputValue(masked);

    // validate + emit
    if (updated.month && updated.day && updated.year) {
      if (isValidMDY(updated.month, updated.day, updated.year)) {
        setFormatError(null);
        emitISO(updated.month, updated.day, updated.year);
      } else {
        setFormatError("Invalid date");
      }
    }
  };

  // Strict mask typing + live validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = onlyDigits(e.target.value).slice(0, 8); // MMDDYYYY
    const masked = formatMask(digits);
    setInputValue(masked);

    if (masked.length === 0) {
      setFormatError(null);
      setDate({ month: "", day: "", year: "" });
      return;
    }
    if (masked.length < 10) {
      setFormatError("Use MM/DD/YYYY");
      return;
    }

    const match = masked.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      setFormatError("Use MM/DD/YYYY");
      return;
    }
    const [, mm, dd, yyyy] = match;
    if (!isValidMDY(mm, dd, yyyy)) {
      setFormatError("Invalid date");
      return;
    }

    setFormatError(null);
    setDate({ month: mm, day: dd, year: yyyy });
    emitISO(mm, dd, yyyy);
  };

  // Keep slashes from being deleted; nudge caret around them
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const pos = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? pos;
    // avoid slash deletion on Backspace/Delete when no range selected
    const atSlashLeft = pos === 3 || pos === 6;   // caret right after a slash
    const atSlash = pos === 2 || pos === 5;       // caret on a slash

    if (e.key === "Backspace" && pos === end && atSlashLeft) {
      e.preventDefault();
      // move caret before slash
      requestAnimationFrame(() => input.setSelectionRange(pos - 1, pos - 1));
      return;
    }
    if (e.key === "Delete" && pos === end && atSlash) {
      e.preventDefault();
      // move caret after slash
      requestAnimationFrame(() => input.setSelectionRange(pos + 1, pos + 1));
      return;
    }
  };

  // Clean paste -> mask
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const digits = onlyDigits(pasted).slice(0, 8);
    const masked = formatMask(digits);
    setInputValue(masked);

    if (masked.length === 10) {
      const [, mm, dd, yyyy] = masked.match(/^(\d{2})\/(\d{2})\/(\d{4})$/) ?? [];
      if (mm && isValidMDY(mm, dd, yyyy)) {
        setFormatError(null);
        setDate({ month: mm, day: dd, year: yyyy });
        emitISO(mm, dd, yyyy);
      } else {
        setFormatError("Invalid date");
      }
    } else if (masked.length > 0) {
      setFormatError("Use MM/DD/YYYY");
    } else {
      setFormatError(null);
    }
  };

  return (
    <div>
      <TextField
        inputRef={inputRef}
        label={label}
        value={inputValue}
        error={hasError}
        helperText={helperText}
        fullWidth
        size="medium"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        inputProps={{
          maxLength: 10,
          placeholder: "MM/DD/YYYY",
          inputMode: "numeric",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <CalendarTodayIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box p={2} minWidth={420}>
          <Typography variant="subtitle2" gutterBottom>
            Select Date
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                select
                label="Month"
                fullWidth
                value={date.month}
                onChange={(e) => updateDate("month", e.target.value)}
                sx={{ "& .MuiSelect-select": { paddingRight: "8px !important", minWidth: 70 } }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const m = i + 1;
                  return (
                    <MenuItem key={m} value={pad2(m)}>
                      {m}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={4}>
              <TextField
                select
                label="Day"
                fullWidth
                value={date.day}
                onChange={(e) => updateDate("day", e.target.value)}
                sx={{ "& .MuiSelect-select": { paddingRight: "8px !important", minWidth: 70 } }}
              >
                {(() => {
                  const m = Number(date.month || "01");
                  const y = Number(date.year || "2000");
                  const dim = daysInMonth(m || 1, y || 2000);
                  return Array.from({ length: dim }, (_, i) => i + 1).map((d) => (
                    <MenuItem key={d} value={pad2(d)}>
                      {d}
                    </MenuItem>
                  ));
                })()}
              </TextField>
            </Grid>

            <Grid item xs={4}>
              <TextField
                select
                label="Year"
                fullWidth
                value={date.year}
                onChange={(e) => updateDate("year", e.target.value)}
                sx={{ "& .MuiSelect-select": { paddingRight: "8px !important", minWidth: 90 } }}
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