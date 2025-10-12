// ConfirmationButton.tsx
import Button from '@mui/material/Button';
import React from 'react';
import styles from './botaoTemporario.module.css';

interface ConfirmationButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export default function ConfirmationButton({
  onClick,
  children,
  type = 'button', 
}: ConfirmationButtonProps) {
  return (
    <Button
      onClick={onClick}
      type={type} 
      className={styles.button}
    >
      {children}
    </Button>
  );
}
