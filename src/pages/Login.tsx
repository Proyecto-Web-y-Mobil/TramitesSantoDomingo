import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonItem, IonInput, IonButton, IonText, IonIcon 
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons'; // Importamos los iconos necesarios

const Login: React.FC = () => {
  const [userCredential, setUserCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false); // Estado para la visibilidad de la clave

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', userCredential);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          {/* Fila centrada vertical y horizontalmente con altura total de pantalla */}
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '100vh' }}>
            <IonCol size="12" sizeMd="8" sizeLg="5" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden', padding: '0' }}>
              
              {/* Header Azul Centrado */}
              <div style={{ backgroundColor: '#0088d6', padding: '20px', display: 'flex', alignItems: 'center', position: 'relative', minHeight: '100px' }}>
                <img 
                  src="/assets/logo.webp" 
                  alt="Logo" 
                  style={{ height: '70px', width: 'auto', zIndex: 2 }} 
                />
                <div style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center', pointerEvents: 'none' }}>
                  <h2 style={{ color: 'white', margin: '0', fontSize: '1.6rem', fontWeight: 'bold', fontStyle: 'italic', display: 'inline-block' }}>
                    Inicio de Sesión
                  </h2>
                </div>
              </div>

              <form onSubmit={handleLogin} style={{ padding: '30px' }}>
                {/* Campo Usuario */}
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>RUT / Correo Electrónico</label>
                  <IonItem lines="outline" className="rounded-md">
                    <IonInput 
                      value={userCredential} 
                      placeholder="12345678-9 / ejemplo@gmail.com" 
                      onIonChange={e => setUserCredential(e.detail.value!)} 
                    />
                  </IonItem>
                </div>

                {/* Campo Contraseña con botón de visibilidad */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Contraseña</label>
                  <IonItem lines="outline">
                    <IonInput 
                      type={showPass ? 'text' : 'password'} 
                      value={password} 
                      placeholder="ejemplo123" 
                      onIonChange={e => setPassword(e.detail.value!)} 
                    />
                    <IonButton fill="clear" slot="end" onClick={() => setShowPass(!showPass)} style={{ margin: 0 }}>
                      <IonIcon icon={showPass ? eyeOff : eye} color="medium" />
                    </IonButton>
                  </IonItem>
                </div>

                <p style={{ fontSize: '0.9rem', marginBottom: '25px' }}>
                  <a href="#" style={{ color: '#666', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
                </p>

                <IonButton expand="block" type="submit" style={{ marginBottom: '15px', '--background': '#0056b3', fontWeight: 'bold' }}>
                  INICIAR SESIÓN
                </IonButton>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', marginBottom: '30px' }}>
                  ¿No tienes una cuenta? <a href="/register" style={{ color: '#0088d6', fontWeight: 'bold' }}>regístrate</a>
                </p>

                {/* Sección ClaveÚnica */}
                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>También puedes ingresar con tu ClaveÚnica</p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="button" style={{ border: 'none', background: 'none', padding: '0', cursor: 'pointer' }}>
                      <img 
                        src="/assets/ClaveUnica.png" 
                        alt="Clave Única" 
                        style={{ height: '45px', width: 'auto' }} 
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