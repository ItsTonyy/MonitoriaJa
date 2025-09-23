import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import styles from './PerfilUsuarioPage.module.css';
import ReusableButton from '../../components/common/ReusableButton';

const PerfilAlunoPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main className={`${styles.centralizeContent}`}>
            <Box className={styles.profileCard}>
                <Box className={styles.profileHeader}>
                    <Box className={styles.photoSection}>
                        <Box className={styles.photoContainer}>
                            <PersonIcon className={styles.profilePhotoIcon} />
                        </Box>
                    </Box>
                    <ReusableButton
                        text="Trocar foto"
                        className={styles.uploadButton}
                    />
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <TextField
                            label="Nome"
                            variant="outlined"
                            fullWidth
                            defaultValue="Aluno X"
                            className={styles.inputField}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            defaultValue="email@exemplo.com"
                            className={styles.inputField}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </Box>
                <Box className={styles.contactSection}>
                    <Typography variant="h6" className={styles.contactTitle}>
                        Contato
                    </Typography>
                    <TextField
                        label="Telefone"
                        variant="outlined"
                        fullWidth
                        defaultValue="(21) 99999-9999"
                        className={styles.inputField}
                    />
                </Box>
                <Box className={styles.buttonSection}>
                    <ReusableButton
                        text="Trocar senha"
                        className={styles.reusableButton}
                    />
                    <ReusableButton
                        text="Voltar"
                        className={`${styles.reusableButton} ${styles.backButton}`}
                        onClick={() => navigate(-1)} // Retorna à página anterior
                    />
                </Box>
            </Box>
        </main>
    );
};

export default PerfilAlunoPage;