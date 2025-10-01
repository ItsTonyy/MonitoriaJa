import React from 'react';
import styles from './Descricao.module.css';

interface DescriptionBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const DescriptionBox: React.FC<DescriptionBoxProps> = ({ value, onChange, placeholder = '', rows = 4 }) => {
  return (
    <textarea
      className={styles.editableTextarea}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

export default DescriptionBox;