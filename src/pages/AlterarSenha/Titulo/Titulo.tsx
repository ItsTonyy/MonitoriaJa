import React from 'react';
import { Typography } from '@mui/material';
import styles from './Titulo.module.css';

interface TituloProps {
  text: string;
}

const Titulo: React.FC<TituloProps> = ({ text }) => {
  return (
    <Typography
      variant="h4"
      component="h1"
      gutterBottom
      className={styles.title}
    >
      {text}
    </Typography>
  );
};

export default Titulo;
