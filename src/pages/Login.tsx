import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonItem, IonInput, IonButton, IonIcon 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { eye, eyeOff } from 'ionicons/icons';
import { authService } from '../services/authService';
import ConstructionAlert from '../components/ConstructionAlert';

const Login: React.FC = () => {
  const history = useHistory();
  const [userCredential, setUserCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const credential = userCredential.trim();
    const pass = password.trim();
    const user = authService.login(credential, pass);
    
    if (user) {
      setTimeout(() => history.push('/tramites-user'), 100);
    } else {
      alert("Usuario no encontrado. Revisa los datos.");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '100vh' }}>
            <IonCol size="12" sizeMd="8" sizeLg="5" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden', padding: '0' }}>
              
              <div style={{ backgroundColor: '#0088d6', padding: '20px', display: 'flex', alignItems: 'center', position: 'relative', minHeight: '100px' }}>
                <img src="/assets/logo.webp" alt="Logo" style={{ height: '70px', zIndex: 2 }} />
                <div style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center' }}>
                  <h2 style={{ color: 'white', margin: '0', fontSize: '1.6rem', fontWeight: 'bold', fontStyle: 'italic' }}>Inicio de Sesión</h2>
                </div>
              </div>

              <form onSubmit={handleLogin} style={{ padding: '30px' }}>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>RUT / Correo Electrónico</label>
                  <IonItem lines="outline">
                    <IonInput 
                      value={userCredential} 
                      placeholder="12.345.678-9 / ejemplo@gmail.com" 
                      onIonChange={e => setUserCredential(e.detail.value!)} 
                    />
                  </IonItem>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Contraseña</label>
                  <IonItem lines="outline">
                    <IonInput 
                      type={showPass ? 'text' : 'password'} 
                      value={password} 
                      placeholder="ejemplo123"
                      onIonChange={e => setPassword(e.detail.value!)} 
                    />
                    <IonButton fill="clear" slot="end" onClick={() => setShowPass(!showPass)}>
                      <IonIcon icon={showPass ? eyeOff : eye} color="medium" />
                    </IonButton>
                  </IonItem>
                </div>

                <p style={{ fontSize: '0.9rem', marginBottom: '25px' }}>
                  <ConstructionAlert>
                    <a href="#" style={{ color: '#666', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
                  </ConstructionAlert>
                </p>

                <IonButton expand="block" type="submit" style={{ marginBottom: '15px', '--background': '#0056b3' }}>
                  INICIAR SESIÓN
                </IonButton>

                {/* Bloque de Clave Única corregido y centrado */}
                <div style={{ borderTop: '1px solid #ddd', padding: '15px 0', marginTop: '10px', textAlign: 'center' }}>
                  <p style={{ color: '#666', marginBottom: '15px', fontSize: '0.9rem' }}>
                    Tambien puedes iniciar sesion con Clave Unica
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ConstructionAlert>
                      <img 
                        src="/assets/ClaveUnica.png" 
                        alt="Clave Única" 
                        style={{ height: '40px', width: 'auto', cursor: 'pointer', display: 'block', margin: '0 auto' }}
                      />
                    </ConstructionAlert>
                  </div>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '20px' }}>
                  ¿No tienes una cuenta? <a href="/register" style={{ color: '#0088d6', fontWeight: 'bold' }}>regístrate</a>
                </p>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;