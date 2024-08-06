// ReusableButton.jsx
import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const ButtonBox = ({
  label,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  onClick,
  fullWidth,
  ...props
}) => {
  return (
    <Stack spacing={2} direction="row">
      <Button
        variant={variant}
        color={color}
        size={size}
        fullWidth={fullWidth && fullWidth}
        onClick={onClick}
        {...props}
      >
        {label}
      </Button>
    </Stack>
  );
};

export default ButtonBox;
