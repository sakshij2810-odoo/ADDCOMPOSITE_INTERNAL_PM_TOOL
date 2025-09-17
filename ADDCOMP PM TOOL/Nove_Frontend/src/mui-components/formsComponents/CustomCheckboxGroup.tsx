import React from 'react';
import { Grid, Typography, Box, Checkbox, Stack } from '@mui/material';

interface CustomCheckboxGroupProps {
  columnName: string;
  selectedOption: string;
  handleChangeCheck: (value: string) => void;
  setFieldValue: (fieldName: string, value: string) => void;
}

const CustomCheckboxGroup: React.FC<CustomCheckboxGroupProps> = ({
  columnName,
  selectedOption,
  handleChangeCheck,
  setFieldValue,
}) => {
  const handleCheckboxChange = (value: string) => {
    handleChangeCheck(value);
    const currentValue = value === 'Yes' ? 'Y' : 'N';
    setFieldValue(`${columnName}`, currentValue);
  };

  return (
    <Grid item xs={12} lg={2.4}>
      <Stack direction="row" spacing={1}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Checkbox
            onChange={() => handleCheckboxChange('Yes')}
            disabled={selectedOption === 'No'}
          />
          <Typography>Yes</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Checkbox
            onChange={() => handleCheckboxChange('No')}
            disabled={selectedOption === 'Yes'}
          />
          <Typography>No</Typography>
        </Box>
      </Stack>
    </Grid>
  );
};

export default CustomCheckboxGroup;
