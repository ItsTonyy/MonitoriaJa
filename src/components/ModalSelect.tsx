import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90vw', sm: 350, md: 400 },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

interface Opcao {
    label: string;
    value: string;
}

interface ModalSelectGenericoProps {
    open: boolean;
    header: string;
    opcoes: Opcao[];
    onClose: () => void;
    onConfirm: (selectedValue: string) => void;
    buttonText?: string;
}

function ModalSelect({
    open,
    header,
    opcoes,
    onClose,
    onConfirm,
    buttonText = 'Continuar',
}: ModalSelectGenericoProps) {
    const [selected, setSelected] = useState('');
    const [submit, setSubmit] = useState(false);
    const theme = useTheme();
    const breakpointMd = useMediaQuery(theme.breakpoints.up('md'));

    const handleConfirm = () => {
        setSubmit(true);
        if (selected) {
            onConfirm(selected);
            onClose();
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setSelected(event.target.value);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    {header}
                </Typography>

                <FormControl error={submit && !selected}>
                    <Select
                        value={selected}
                        onChange={handleChange}
                        required
                    >
                        {opcoes.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {submit && !selected && (
                        <FormHelperText>Selecione uma opção</FormHelperText>
                    )}
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                        size={breakpointMd ? 'medium' : 'small'}
                    >
                        {buttonText}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalSelect;
