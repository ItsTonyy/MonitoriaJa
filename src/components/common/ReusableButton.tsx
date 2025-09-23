import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ReusableButtonProps extends ButtonProps {
  text?: string;
  colorType?: 'primary' | 'secondary' | 'accent';
}

const colorMap = {
  primary: '#104c91',
  secondary: '#1f8ac0',
  accent: '#efc9af',
};

const StyledButton = styled(Button)<{ colorType: 'primary' | 'secondary' | 'accent' }>(
  ({ colorType }) => ({
    backgroundColor: colorMap[colorType],
    color: '#ffffff',
    fontWeight: 'bold',
    borderRadius: '15px',
    padding: '12px 0',
    '&:hover': {
      backgroundColor:
        colorType === 'primary' ? colorMap.secondary : colorMap[colorType],
    },
    '&:disabled': {
      backgroundColor: '#ccc',
      color: '#666',
    },
  })
);

const ReusableButton: React.FC<ReusableButtonProps> = ({
  text,
  colorType = 'primary',
  children,
  ...rest
}) => {
  return (
    <StyledButton colorType={colorType} {...rest}>
      {text || children}
    </StyledButton>
  );
};

export default ReusableButton;
