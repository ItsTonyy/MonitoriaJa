import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from './CampoFormulario.module.css';

interface InputFieldProps {
  label: string;
  defaultValue?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

const CampoFormulario: React.FC<InputFieldProps> = ({
  label,
  defaultValue = '',
  type = 'text',
  value,
  onChange,
  error = false,
  helperText = '',
}) => {
  // controla se a senha está visível
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';

  return (
    <TextField
      label={label}
      variant="outlined"
      defaultValue={defaultValue}
      type={isPassword && !showPassword ? 'password' : 'text'}
      fullWidth
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      className={styles.CampoFormulario}
      InputProps={
        isPassword
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()} // evita perder foco
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
    />
  );
};

export default CampoFormulario;
