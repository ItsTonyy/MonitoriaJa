import React from 'react';
import { TextField } from '@mui/material';
import styles from './CampoFormulario.module.css';

interface InputFieldProps {
  label: string;
  defaultValue?: string;
  type?: string;
}

const CampoFormulario: React.FC<InputFieldProps> = ({
  label,
  defaultValue = '',
  type = 'text',
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      defaultValue={defaultValue}
      type={type}
      fullWidth
      className={styles.CampoFormulario}
    />
  );
};

export default CampoFormulario;
