import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface AtualizarMateriaProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}

const AtualizarMateria: React.FC<AtualizarMateriaProps> = ({ value, onChange, options }) => {
  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Adicionar disciplinas"
          placeholder="Pesquisar disciplinas"
        />
      )}
    />
  );
};

export default AtualizarMateria;
