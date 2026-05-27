import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonItem, IonInput, IonButton, IonIcon 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { eye, eyeOff } from 'ionicons/icons';
import { authService } from '../services/authService';
import ConstructionAlert from '../components/ConstructionAlert';

const Register: React.FC = () => {
  const history = useHistory();
  const [showPass, setShowPass] = useState(false);

  // El manejador pasa a ser asíncrono para pegarle a la API REST (EP 2.4)
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Captura limpia del árbol DOM al vuelo con FormData para mitigar bugs de sincronización
    const data = new FormData(e.currentTarget);
    
    const password = (data.get('password-input') as string || '').trim();
    const confirmPassword = (data.get('confirmPassword-input') as string || '').trim();

    // Validación en el cliente: Contraseñas idénticas (EP 2.6)
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Estructuramos el objeto JSON exacto que tu servidor Express espera procesar (EP 2.3)
    const nuevoUsuario = {
      nombres: (data.get('nombres-input') as string || '').trim(),
      apellidoP: (data.get('apellidoP-input') as string || '').trim(),
      apellidoM: (data.get('apellidoM-input') as string || '').trim(),
      rut: (data.get('rut-input') as string || '').trim(),
      correo: (data.get('correo-input') as string || '').trim(),
      region: (data.get('region-input') as string || '').trim(),
      comuna: (data.get('comuna-input') as string || '').trim(),
      password: password,
      rol: 'ciudadano' // Campo implícito obligatorio para el control de roles del backend (EP 2.5)
    };

    // Validación de obligatoriedad básica en el cliente
    if (!nuevoUsuario.rut || !nuevoUsuario.correo || !nuevoUsuario.password) {
      alert("RUT, Correo y Contraseña son campos obligatorios.");
      return;
    }
    
    try {
      // Intentamos registrar al usuario en la API con await (EP 2.4)
      await authService.register(nuevoUsuario);
      
      alert("¡Registro exitoso! Ahora inicia sesión.");
      history.push('/login');
      
    } catch (error: any) {
      // Intercepta los errores enviados desde Express (ej: "El usuario ya está registrado")
      alert(error.message || "Error al procesar el registro.");
    }
  };

  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333', fontSize: '0.9rem' };
  const inputContainerStyle = { marginBottom: '25px' }; 
  const columnStyle = { padding: '0 15px' }; 

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '100vh' }}>
            <IonCol size="12" sizeMd="10" sizeLg="8" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden', padding: '0' }}>
              
              <div style={{ backgroundColor: '#0088d6', padding: '20px', display: 'flex', alignItems: 'center', position: 'relative', minHeight: '100px' }}>
                <img src="/assets/logo.webp" alt="Logo" style={{ height: '70px', zIndex: 2 }} />
                <div style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center' }}>
                  <h2 style={{ color: 'white', margin: '0', fontSize: '1.6rem', fontWeight: 'bold', fontStyle: 'italic' }}>Registro de Usuario</h2>
                </div>
              </div>

              {/* El formulario ejecuta nuestro manejador asíncrono */}
              <form onSubmit={handleRegister} style={{ padding: '30px' }}>
                <IonGrid>
                  <IonRow>
                    {/* Columna Izquierda */}
                    <IonCol size="12" sizeMd="6" style={columnStyle}>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Nombres</label>
                        <IonItem lines="outline">
                          <IonInput name="nombres-input" placeholder="Juan Antonio" />
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Apellido Paterno</label>
                        <IonItem lines="outline">
                          <IonInput name="apellidoP-input" placeholder="Pérez" />
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Apellido Materno</label>
                        <IonItem lines="outline">
                          <IonInput name="apellidoM-input" placeholder="García" />
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>RUT</label>
                        <IonItem lines="outline">
                          <IonInput name="rut-input" placeholder="12.345.678-9" />
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Correo Electrónico</label>
                        <IonItem lines="outline">
                          <IonInput name="correo-input" type="email" placeholder="ejemplo@correo.com" />
                        </IonItem>
                      </div>
                    </IonCol>

                    {/* Columna Derecha */}
                    <IonCol size="12" sizeMd="6" style={columnStyle}>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Región</label>
                        <IonItem lines="outline">
                          <IonInput name="region-input" placeholder="Valparaíso" />
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Comuna</label>
                        <IonItem lines="outline">
                          <IonInput name="comuna-input" placeholder="Santo Domingo" />
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Contraseña</label>
                        <IonItem lines="outline">
                          <IonInput 
                            name="password-input"
                            type={showPass ? 'text' : 'password'} 
                            placeholder="********"
                          />
                          <IonButton fill="clear" slot="end" onClick={() => setShowPass(!showPass)}>
                            <IonIcon icon={showPass ? eyeOff : eye} />
                          </IonButton>
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Confirmar Contraseña</label>
                        <IonItem lines="outline">
                          <IonInput 
                            name="confirmPassword-input"
                            type={showPass ? 'text' : 'password'} 
                            placeholder="********"
                          />
                        </IonItem>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>
                    Al crear un perfil aceptas los {' '}
                    <ConstructionAlert>
                      <a href="#" style={{ color: '#0088d6', textDecoration: 'none', fontWeight: 'bold' }}>
                        términos y condiciones
                      </a>
                    </ConstructionAlert>
                  </p>
                  <IonButton expand="block" type="submit" style={{ maxWidth: '300px', margin: '0 auto', '--background': '#0056b3' }}>
                    REGISTRARSE
                  </IonButton>
                </div>
              </form>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Register;