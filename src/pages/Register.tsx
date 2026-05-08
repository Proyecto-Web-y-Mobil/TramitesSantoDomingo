import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonItem, IonInput, IonButton, IonIcon 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { eye, eyeOff } from 'ionicons/icons';
import { authService } from '../services/authService';

const Register: React.FC = () => {
  const history = useHistory();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '', apellidoP: '', apellidoM: '',
    rut: '', correo: '', region: '',
    comuna: '', password: '', confirmPassword: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      
      authService.register(formData);
      
      alert("¡Registro exitoso! Ahora inicia sesión.");
      history.push('/login');
      
    } catch (error: any) {
      alert(error.message);
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
            <IonCol size="12" sizeLg="9" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden', padding: '0' }}>
              
              <div style={{ backgroundColor: '#0088d6', padding: '20px', display: 'flex', alignItems: 'center', position: 'relative', minHeight: '80px' }}>
                <img src="/assets/logo.webp" alt="Logo" style={{ height: '60px', zIndex: 2 }} />
                <div style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center' }}>
                  <h2 style={{ color: 'white', margin: '0', fontSize: '1.8rem', fontWeight: 'bold' }}>Registro</h2>
                </div>
              </div>

              <form onSubmit={handleRegister} style={{ padding: '30px' }}>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" sizeMd="6" style={columnStyle}>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Nombres</label>
                        <IonItem lines="outline">
                          <IonInput 
                            placeholder="Ej: Juan Andrés"
                            onIonChange={e => setFormData({...formData, nombres: e.detail.value!})} 
                          />
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Apellido paterno</label>
                        <IonItem lines="outline"><IonInput onIonChange={e => setFormData({...formData, apellidoP: e.detail.value!})} /></IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Apellido materno</label>
                        <IonItem lines="outline"><IonInput onIonChange={e => setFormData({...formData, apellidoM: e.detail.value!})} /></IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>RUT</label>
                        <IonItem lines="outline">
                          <IonInput 
                            placeholder="12.345.678-9" 
                            onIonChange={e => setFormData({...formData, rut: e.detail.value!})} 
                          />
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Correo Electrónico</label>
                        <IonItem lines="outline">
                          <IonInput 
                            type="email" 
                            placeholder="ejemplo@correo.com"
                            onIonChange={e => setFormData({...formData, correo: e.detail.value!})} 
                          />
                        </IonItem>
                      </div>
                    </IonCol>

                    <IonCol size="12" sizeMd="6" style={columnStyle}>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Región</label>
                        <IonItem lines="outline"><IonInput onIonChange={e => setFormData({...formData, region: e.detail.value!})} /></IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Comuna</label>
                        <IonItem lines="outline"><IonInput onIonChange={e => setFormData({...formData, comuna: e.detail.value!})} /></IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Contraseña</label>
                        <IonItem lines="outline">
                          <IonInput 
                            type={showPass ? 'text' : 'password'} 
                            placeholder="********"
                            onIonChange={e => setFormData({...formData, password: e.detail.value!})} 
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
                            type={showPass ? 'text' : 'password'} 
                            placeholder="********"
                            onIonChange={e => setFormData({...formData, confirmPassword: e.detail.value!})} 
                          />
                        </IonItem>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>
                    Al crear un perfil aceptas los <a href="#" style={{ color: '#0088d6' }}>términos y condiciones</a>
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