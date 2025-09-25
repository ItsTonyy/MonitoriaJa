import TextField from '@mui/material/TextField';
import React from 'react';

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  tipo?: string;
  valor: string;
  aoMudar: (e: React.ChangeEvent<HTMLInputElement>) => void;
  erro?: boolean;
  textoAjuda?: string;
  maxLength?: number;
}

function InputForm({ id, label, placeholder, tipo = 'text', valor, aoMudar, erro, textoAjuda, maxLength }: Props) {
  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      placeholder={placeholder}
      type={tipo}
      value={valor}
      onChange={aoMudar}
      error={!!erro}
      helperText={textoAjuda}
      inputProps={maxLength ? { maxLength } : undefined}
      fullWidth
      sx={{ maxWidth: { xs: '100%', sm: 400, md: 500 } }}
    />
  );
}

export default InputForm;