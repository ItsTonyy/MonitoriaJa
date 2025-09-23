import Button from '@mui/material/Button';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function CadastroHeader() {
  return (
    <header>
        <h1>Cadastre-se</h1>
        <Avatar
            sx={{ 
                width: 100, 
                height: 100,
                justifySelf: 'center',
                marginBottom: 3,
                border: '1px solid gray'
            }}
            src="/broken-image.jpg" />
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<AddAPhotoIcon />}
        >
            Insira sua foto
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                max={1}
            />
        </Button>
    </header>
  );
}

export default CadastroHeader;