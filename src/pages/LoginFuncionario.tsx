import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonItem, IonInput, IonButton, IonIcon 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { eye, eyeOff } from 'ionicons/icons';
import { authService } from '../services/authService';
import BannerFoto from '../components/BannerFoto';

const LoginFuncionario: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Captura directa del formulario para asegurar que no se lean campos vacíos
    const data = new FormData(e.currentTarget);
    const emailLimpio = (data.get('email-input') as string || email).trim();
    const passLimpio = (data.get('pass-input') as string || password).trim();
  
    if (!emailLimpio || !passLimpio) {
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    const user = authService.login(emailLimpio, passLimpio);
    
    if (user) {
      // Pequeño delay de 100ms para asegurar que la sesión se escriba en disco
      // antes de que el AdminDashboard intente validarla.
      setTimeout(() => {
        history.replace('/admin-dashboard');
      }, 100);
    } else {
      alert("Credenciales de inicio de sesión incorrectas.");
    }
  };

  return (
    <IonPage>
      <BannerFoto titulo="Acceso Funcionario" />

      <IonContent className="ion-padding" style={{ '--background': '#f0f0f0' }}>
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '65vh' }}>
            <IonCol size="12" sizeMd="8" sizeLg="5" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', padding: '40px 30px' }}>
              <h2 style={{ textAlign: 'center', color: '#1b3a6b', fontWeight: 'bold' }}>Panel Administrativo</h2>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '30px' }}>Ingrese sus credenciales institucionales</p>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Correo Institucional</label>
                  <IonItem lines="outline">
                    <IonInput 
                      name="email-input"
                      type="email" 
                      value={email} 
                      placeholder="usuario@municipalidad.cl" 
                      onIonChange={e => setEmail(e.detail.value!)} 
                    />
                  </IonItem>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Contraseña</label>
                  <IonItem lines="outline">
                    <IonInput 
                      name="pass-input"
                      type={showPass ? 'text' : 'password'} 
                      value={password} 
                      placeholder="********" 
                      onIonChange={e => setPassword(e.detail.value!)} 
                    />
                    <IonButton fill="clear" slot="end" onClick={() => setShowPass(!showPass)}>
                      <IonIcon icon={showPass ? eyeOff : eye} color="medium" />
                    </IonButton>
                  </IonItem>
                </div>

                <IonButton expand="block" type="submit" style={{ marginTop: '30px', '--background': '#1b3a6b', height: '45px' }}>
                  INICIAR SESIÓN
                </IonButton>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <a href="/login" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>← Volver al Acceso Ciudadano</a>
                </div>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default LoginFuncionario;