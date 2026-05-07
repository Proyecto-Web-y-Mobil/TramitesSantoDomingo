import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonItem, IonInput, IonButton, IonIcon, IonLabel
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
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      authService.register(formData);
      alert("¡Registro exitoso! Ahora inicia sesión.");
      history.push('/login');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px' };
  const inputContainerStyle = { marginBottom: '15px' };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ minHeight: '100vh' }}>
            <IonCol size="12" sizeMd="10" sizeLg="8" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden', padding: '0' }}>
              
              {/* NUEVO BANNER AZUL INTEGRADO */}
              <div style={{ backgroundColor: '#0088d6', padding: '20px', display: 'flex', alignItems: 'center', position: 'relative', minHeight: '100px' }}>
                <img src="/assets/logo.webp" alt="Logo" style={{ height: '70px', zIndex: 2 }} />
                <div style={{ position: 'absolute', width: '100%', left: 0, textAlign: 'center' }}>
                  <h2 style={{ color: 'white', margin: '0', fontSize: '1.6rem', fontWeight: 'bold', fontStyle: 'italic' }}>
                    Registro
                  </h2>
                </div>
              </div>

              <form onSubmit={handleRegister} style={{ padding: '30px' }}>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Nombres</label>
                        <IonItem lines="outline"><IonInput onIonChange={e => setFormData({...formData, nombres: e.detail.value!})} /></IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Apellido Paterno</label>
                        <IonItem lines="outline"><IonInput onIonChange={e => setFormData({...formData, apellidoP: e.detail.value!})} /></IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>RUT</label>
                        <IonItem lines="outline"><IonInput placeholder="12.345.678-9" onIonChange={e => setFormData({...formData, rut: e.detail.value!})} /></IonItem>
                      </div>
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Correo Electrónico</label>
                        <IonItem lines="outline"><IonInput type="email" onIonChange={e => setFormData({...formData, correo: e.detail.value!})} /></IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Contraseña</label>
                        <IonItem lines="outline">
                          <IonInput type={showPass ? 'text' : 'password'} onIonChange={e => setFormData({...formData, password: e.detail.value!})} />
                          <IonButton fill="clear" slot="end" onClick={() => setShowPass(!showPass)}><IonIcon icon={showPass ? eyeOff : eye} /></IonButton>
                        </IonItem>
                      </div>
                      <div style={inputContainerStyle}>
                        <label style={labelStyle}>Confirmar Contraseña</label>
                        <IonItem lines="outline">
                          <IonInput type={showPass ? 'text' : 'password'} onIonChange={e => setFormData({...formData, confirmPassword: e.detail.value!})} />
                        </IonItem>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <div style={{ textAlign: 'center' }}>
                  <IonButton expand="block" type="submit" style={{ maxWidth: '300px', margin: '0 auto', '--background': '#0056b3' }}>
                    REGISTRARSE
                  </IonButton>
                  <p style={{ marginTop: '15px' }}>¿Ya tienes cuenta? <a href="/login" style={{ color: '#0088d6', fontWeight: 'bold' }}>Inicia sesión</a></p>
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