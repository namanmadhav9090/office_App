// FormInput.jsx
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const InputBox = ({ id, label, variant, width = '25ch', ...props }) => {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: width },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id={id}
        label={label}
        variant={variant}
        {...props}
      />
    </Box>
  );
};

export default InputBox;
