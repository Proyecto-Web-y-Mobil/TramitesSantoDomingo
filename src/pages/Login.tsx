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
  const [showPass, setShowPass] = useState(false);

  // El manejador ahora es asíncrono (async) para soportar la petición de red (EP 2.4)
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Captura robusta de datos directa desde el árbol DOM usando FormData
    const data = new FormData(e.currentTarget);
    const rutLimpio = (data.get('rut-input') as string || '').trim();
    const passLimpio = (data.get('pass-input') as string || '').trim();
  
    // Validación de inputs del lado del cliente (EP 2.6)
    if (!rutLimpio || !passLimpio) {
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    try {
      // Consumo de la API con await esperando la validación y el JWT (EP 2.4, EP 2.5)
      const user = await authService.login(rutLimpio, passLimpio);
      
      if (user) {
        // Mantenemos el truco de sincronización para asegurar la escritura del LocalStorage
        setTimeout(() => {
          history.replace('/tramites-user');
        }, 100);
      }
    } catch (error: any) {
      // Captura los errores controlados enviados por el servidor Express (ej: 401 o 400)
      alert(error.message || "RUT o contraseña incorrectos. Revisa los datos.");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '100vh' }}>
            <IonCol size="12" sizeMd="8" sizeLg="5" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden', padding: '0' }}>
              
              {/* Header del Login */}
              <div style={{ backgroundColor: '#0088d6', padding: '20px', display: 'flex', alignItems: 'center', position: 'relative', minHeight: '100px' }}>
                <img src="/assets/logo.webp" alt="Logo" style={{ height: '70px', zIndex: 2 }} />
                <div style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center' }}>
                  <h2 style={{ color: 'white', margin: '0', fontSize: '1.6rem', fontWeight: 'bold', fontStyle: 'italic' }}>Inicio de Sesión</h2>
                </div>
              </div>

              {/* El formulario ejecuta nuestro manejador asíncrono */}
              <form onSubmit={handleLogin} style={{ padding: '30px' }}>
                <div style={{ GridBottom: '25px', marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>RUT</label>
                  <IonItem lines="outline">
                    {/* Agregamos el atributo 'name' para que FormData capture el valor */}
                    <IonInput 
                      name="rut-input"
                      placeholder="12.345.678-9" 
                    />
                  </IonItem>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Contraseña</label>
                  <IonItem lines="outline">
                    {/* Agregamos el atributo 'name' para que FormData capture el valor */}
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
                
                <IonButton expand="block" type="submit" style={{ marginBottom: '15px', '--background': '#0056b3' }}>
                  INICIAR SESIÓN
                </IonButton>

                {/* Bloque de Clave Única */}
                <div style={{ borderTop: '1px solid #ddd', padding: '15px 0', marginTop: '10px', textAlign: 'center' }}>
                  <p style={{ color: '#666', marginBottom: '15px', fontSize: '0.9rem' }}>
                    También puedes iniciar sesión con Clave Única
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