import React from 'react';
import TextField from '@mui/material/TextField';
import styles from './Descricao.module.css';

interface DescriptionBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const DescriptionBox: React.FC<DescriptionBoxProps> = ({ 
  value, 
  onChange, 
  placeholder = '', 
  rows = 4 
}) => {
  return (
    <TextField
      className={styles.editableTextarea}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      multiline
      rows={rows}
      variant="outlined"
      fullWidth
    />
  );
};

export default DescriptionBox;