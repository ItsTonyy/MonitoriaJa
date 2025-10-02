import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import styles from './AtualizarMateria.module.css';

interface AtualizarMateriaProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  options: string[];
  sx?: object; // permite passar estilo externo
}

const AtualizarMateria: React.FC<AtualizarMateriaProps> = ({
  value,
  onChange,
  label = "Adicionar Disciplina",
  options,
  sx = {}, // padrão vazio
}) => {
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      onInputChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" fullWidth />
      )}
      sx={{ width: '100%', ...sx }} // ocupa 100% do container e aceita overrides
      slotProps={{
        paper: {
          className: styles.paper,
        },
        listbox: {
          className: styles.listBox,
        },
      }}
    />
  );
};

export default AtualizarMateria;
