import Button from '@mui/material/Button';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

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
    const [avatar, setAvatar] = useState<string | undefined>(undefined);

    const mudarAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ justifySelf: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>Cadastre-se</Typography>
            <Avatar
                sx={{
                    width: 100,
                    height: 100,
                    justifySelf: 'center',
                    marginBottom: 3,
                    border: '1px solid gray',
                }}
                src={avatar || '/broken-image.jpg'}
            />
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
                    accept="image/*"
                    onChange={mudarAvatar}
                />
            </Button>
        </Box>
    );
}

export default CadastroHeader;