/* eslint-disable react/prop-types */
import type {
  IconButtonProps
} from "@mui/material";

import { Box } from "@mui/system";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";

interface ITablePaginationProps {
  count: number;
  onPageChange: (e: any, page: number) => void;
  page: number;
  rowsPerPage: number;
  nextIconButtonProps?: Partial<IconButtonProps>;
  extraFetchFactor?: number;
}

export const TablePaginationActions: React.FC<ITablePaginationProps> = (
  props
) => {
  const theme = useTheme();
  const {
    count,
    page,
    rowsPerPage,
    onPageChange,
    nextIconButtonProps = { disabled: false },
    extraFetchFactor,
  } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      {!extraFetchFactor && (
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
      )}
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        sx={{ borderRadius: 0 }}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
        {extraFetchFactor ? <Typography variant="body2">Back</Typography> : ""}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={nextIconButtonProps.disabled}
        aria-label="next page"
        sx={{ borderRadius: 0 }}
      >
        {extraFetchFactor ? <Typography variant="body2">Next</Typography> : ""}
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      {!extraFetchFactor && (
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={nextIconButtonProps.disabled}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      )}
    </Box>
  );
};
