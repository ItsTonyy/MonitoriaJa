import React from 'react'; 
import ConfirmationButton from '../../components/login-form/ConfirmationButton'; 
import styles from './AlterarSenhaPage.module.css'; 
import { useNavigate } from 'react-router-dom'; 
import CampoFormulario from '../PerfilMonitor/CampoFormulario/CampoFormulario';

const AlterarSenhaPage: React.FC = () => { 
    const navigate = useNavigate();

    return (
        <main className={styles.centralizeContent}>
            <div className={styles.profileCard}>
                <h1 className={styles.cardTitle}>Alterar senha</h1>
                
                <div className={styles.fieldsContainer}>
                    <CampoFormulario label="Senha anterior" defaultValue="123" />
                    <CampoFormulario label="Nova senha" defaultValue="234" />
                    <CampoFormulario label="Confirme sua Senha" defaultValue="234" />
                </div>
                
                <div className={styles.buttonSection}>
                    <ConfirmationButton className={styles.reusableButton}>
                        Trocar senha
                    </ConfirmationButton>
                    <ConfirmationButton
                        className={styles.reusableButton}
                        onClick={() => navigate(-1)}
                    >
                        Voltar
                    </ConfirmationButton>
                </div>
            </div>
        </main>
    );
}; 

export default AlterarSenhaPage;