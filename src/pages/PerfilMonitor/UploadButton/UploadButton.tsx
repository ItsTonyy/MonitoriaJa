import React, { useRef } from 'react';
import ConfirmationButton from '../../../components/login-form/ConfirmationButton';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  width: 0,
  height: 0,
  padding: 0,
  margin: 0,
  overflow: 'hidden',
  border: 0,
  clip: 'rect(0 0 0 0)',
});

interface UploadButtonProps {
  className?: string; // recebe sua classe de estilo padronizado
  onFileSelect?: (file: File) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ className, onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect?.(file);
    }
  };

  return (
    <>
      {/* mantém aparência padronizada do botão */}
      <ConfirmationButton className={className} onClick={handleClick}>
        Upload foto
      </ConfirmationButton>
      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadButton;
