import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonItem, IonInput, IonButton, IonText, IonImg 
} from '@ionic/react';

const Login: React.FC = () => {
  const [userCredential, setUserCredential] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', userCredential);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="5" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', marginTop: '20px', padding: '0' }}>
              
              {/* Header Azul con Estilo de Respaldo */}
              <div style={{ backgroundColor: '#0088d6', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <img 
                  src="/assets/logo.webp" 
                  alt="Logo" 
                  style={{ height: '60px', width: 'auto' }} // Forzamos el tamaño del logo aquí
                />
                <h2 style={{ color: 'white', margin: '0', fontSize: '1.5rem', fontWeight: 'bold', fontStyle: 'italic' }}>Inicio de Sesión</h2>
              </div>

              <form onSubmit={handleLogin} style={{ padding: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>RUT / Correo Electrónico</label>
                  <IonItem lines="outline">
                    <IonInput 
                      value={userCredential} 
                      placeholder="12345678-9 / ejemplo@gmail.com" 
                      onIonChange={e => setUserCredential(e.detail.value!)} 
                    />
                  </IonItem>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Contraseña</label>
                  <IonItem lines="outline">
                    <IonInput 
                      type="password" 
                      value={password} 
                      placeholder="ejemplo123" 
                      onIonChange={e => setPassword(e.detail.value!)} 
                    />
                  </IonItem>
                </div>

                <p style={{ fontSize: '0.9rem', marginBottom: '25px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
                </p>

                <IonButton expand="block" type="submit" style={{ marginBottom: '15px', '--background': '#0056b3' }}>
                  INICIAR SESIÓN
                </IonButton>

                <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                  ¿No tienes una cuenta? <a href="#" style={{ color: '#0088d6', fontWeight: 'bold' }}>regístrate</a>
                </p>

                {/* Sección ClaveÚnica Limpia */}
                <div style={{ borderTop: '1px solid #eee', marginTop: '30px', paddingTop: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>También puedes ingresar con tu ClaveÚnica</p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="button" style={{ border: 'none', background: 'none', padding: '0', cursor: 'pointer' }}>
                      <img 
                        src="/assets/ClaveUnica.png" 
                        alt="Clave Única" 
                        style={{ height: '45px', width: 'auto' }} // Ajuste de tamaño para el botón de ClaveÚnica
                      />
                    </button>
                  </div>
                </div>
              </form>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;