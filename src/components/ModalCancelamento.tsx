import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

interface ModalCancelamentoProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (motivo: string) => void;
}

function ModalCancelamento({ open, onClose, onConfirm }: ModalCancelamentoProps) {
    const [motivo, setMotivo] = useState('');

    const handleConfirm = () => {
        onConfirm(motivo);
        setMotivo('');
    };

    const handleClose = () => {
        onClose();
        setMotivo('');
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Cancelar agendamento
                </Typography>
                <TextField
                    label="Motivo do cancelamento"
                    multiline
                    minRows={3}
                    value={motivo}
                    onChange={e => setMotivo(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleClose}>
                        Voltar
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirm}
                        disabled={!motivo.trim()}
                    >
                        Confirmar cancelamento
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalCancelamento;