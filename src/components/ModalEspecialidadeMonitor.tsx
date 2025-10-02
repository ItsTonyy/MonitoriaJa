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

interface ModalEspecialidadeMonitorProps {
   handleEspecialidadeMonitor: (opcao: string) => void;
}

function ModalEspecialidadeMonitor({handleEspecialidadeMonitor}: ModalEspecialidadeMonitorProps) {
    const [opcao, setOpcao] = useState('');
    const [open, setOpen] = useState(true);
    const [submit, setSubmit] = useState(false);
    const theme = useTheme();
    const breakpointMd = useMediaQuery(theme.breakpoints.up('md'));

    function handleContinuar() {
        setSubmit(true);
        if (opcaoValida(opcao)) {
            handleEspecialidadeMonitor(opcao);
            setOpen(false);
        }
    };

    function handleChange(event: SelectChangeEvent) {
      setOpcao(event.target.value as string);
    }

    function opcaoValida(opcao: string) : boolean {
        return opcao !== null && opcao !== '';
    }

    return (
        <Modal open={open}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Selecione sua especialidade
                </Typography>

                <FormControl error={submit && !opcaoValida(opcao)}>                
                     <Select
                        value={opcao}
                        onChange={handleChange}
                        required={true}
                    >
                        <MenuItem value={'matematica'}>Matemática</MenuItem>
                        <MenuItem value={'fisica'}>Física</MenuItem>
                        <MenuItem value={'quimica'}>Química</MenuItem>
                        <MenuItem value={'biologia'}>Biologia</MenuItem>
                        <MenuItem value={'historia'}>História</MenuItem>
                        <MenuItem value={'geografia'}>Geografia</MenuItem>
                        <MenuItem value={'portugues'}>Português</MenuItem>
                        <MenuItem value={'ingles'}>Inglês</MenuItem>
                        <MenuItem value={'programacao'}>Programação</MenuItem>
                    </Select>
                    {submit && (<FormHelperText>Selecione uma opção</FormHelperText> )}
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleContinuar}
                        size={ breakpointMd ? 'medium' : 'small' }
                    >
                        Continuar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalEspecialidadeMonitor;