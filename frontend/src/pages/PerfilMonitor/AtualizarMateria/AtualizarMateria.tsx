import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface AtualizarMateriaProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}

const AtualizarMateria: React.FC<AtualizarMateriaProps> = ({ value, onChange, options }) => {
  // Filtrar opções para mostrar apenas matérias não selecionadas
  const opcoesDisponiveis = options.filter(option => !value.includes(option));

  return (
    <Autocomplete
      multiple
      options={opcoesDisponiveis}
      value={[]} // Sempre vazio - apenas para seleção
      onChange={(event, newValue) => {
        // Adiciona novas matérias sem duplicatas
        if (newValue.length > 0) {
          const novasMaterias = [...value, ...newValue];
          onChange(novasMaterias);
        }
      }}
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