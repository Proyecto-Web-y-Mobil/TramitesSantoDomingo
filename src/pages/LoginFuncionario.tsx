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
  const [showPass, setShowPass] = useState(false);

  // Modificado a manejador asíncrono para consumir la API (EP 2.4)
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Captura directa y limpia del formulario usando la API de FormData
    const data = new FormData(e.currentTarget);
    const emailLimpio = (data.get('email-input') as string || '').trim();
    const passLimpio = (data.get('pass-input') as string || '').trim();
  
    // Validación de obligatoriedad en el cliente (EP 2.6)
    if (!emailLimpio || !passLimpio) {
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    try {
      // Petición real esperando la resolución asíncrona del backend (EP 2.4, EP 2.5)
      const user = await authService.login(emailLimpio, passLimpio);
      
      // Validamos que el usuario retornado posea el rol correspondiente
      if (user && user.rol === 'funcionario') {
        // Mantenemos nuestro delay de 100ms para asegurar la consistencia en el almacenamiento local
        setTimeout(() => {
          history.replace('/admin-dashboard');
        }, 100);
      } else {
        alert("No tiene permisos para acceder al panel administrativo.");
      }
    } catch (error: any) {
      // Atrapa errores HTTP del backend (como claves inválidas o usuario no registrado)
      alert(error.message || "Credenciales de inicio de sesión incorrectas.");
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
                    {/* Quitamos value y onIonChange. FormData se encarga usando 'name' */}
                    <IonInput 
                      name="email-input"
                      type="email" 
                      placeholder="usuario@municipalidad.cl" 
                    />
                  </IonItem>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Contraseña</label>
                  <IonItem lines="outline">
                    {/* Quitamos value y onIonChange. FormData se encarga usando 'name' */}
                    <IonInput 
                      name="pass-input"
                      type={showPass ? 'text' : 'password'} 
                      placeholder="********" 
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