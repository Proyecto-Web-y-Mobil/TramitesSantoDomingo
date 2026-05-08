import { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import BannerFoto from '../components/BannerFoto';

const cssVariables = `
  :root {
    --color-primario: #1a73c8;
    --color-secundario: #1b3a6b;
    --color-fondo: #f0f0f0;
    --color-blanco: #ffffff;
    --color-texto: #333333;
    --border-radius: 8px;
  }
`;

const Profile = () => {
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      const user = JSON.parse(session);
      setNombre(`${user.nombres} ${user.apellidoP} ${user.apellidoM}`);
      setRut(user.rut);
      setCorreo(user.correo);
      setRegion(user.region);
      setComuna(user.comuna);
      setIsLoaded(true);
    } else {
      history.push('/login');
    }
  }, [history]);

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.click();
  };

  if (!isLoaded) return null;

  return (
    <IonPage>
      <style>{cssVariables}</style>

      <div style={{ position: 'relative' }}>
        <BannerFoto titulo="Perfil" />

        {/* Ajuste único: left a 95px */}
        <div style={{ position: 'absolute', bottom: '10px', left: '95px', display: 'flex', gap: '10px' }}>
          <IonButton
            size="small"
            onClick={() => console.log('Ruta trámites no definida')}
            style={{ '--background': '#1a73c8', '--border-radius': '6px', fontSize: '13px', fontWeight: '600' }}
          >
            Mis Trámites
          </IonButton>
          <IonButton
            size="small"
            style={{ '--background': '#1a73c8', '--border-radius': '6px', fontSize: '13px', fontWeight: '600' }}
          >
            Mis Agendas
          </IonButton>
        </div>

        <div style={{ position: 'absolute', bottom: '10px', right: '16px' }}>
          <IonButton
            size="small"
            onClick={() => setEditMode(!editMode)}
            style={{ '--background': '#1b3a6b', '--border-radius': '6px', fontSize: '13px', fontWeight: '600' }}
          >
            {editMode ? 'Guardar Cambios' : 'Modificar Perfil'}
          </IonButton>
        </div>
      </div>

      <IonContent style={{ '--background': '#f0f0f0' }}>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="7" sizeLg="6" size="12">
              <br />
              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>Nombre Completo</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '12px' }}>
                <IonInput value={nombre} readonly={!editMode} onIonChange={e => setNombre(e.detail.value!)} />
              </IonItem>

              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>RUT</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '12px' }}>
                <IonInput value={rut} readonly={!editMode} onIonChange={e => setRut(e.detail.value!)} />
              </IonItem>

              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>Correo Electrónico</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '12px' }}>
                <IonInput type="email" value={correo} readonly={!editMode} onIonChange={e => setCorreo(e.detail.value!)} />
              </IonItem>

              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>Región</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '12px' }}>
                <IonInput value={region} readonly={!editMode} onIonChange={e => setRegion(e.detail.value!)} />
              </IonItem>

              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>Comuna</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '16px' }}>
                <IonInput value={comuna} readonly={!editMode} onIonChange={e => setComuna(e.detail.value!)} />
              </IonItem>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <IonText><p style={{ fontStyle: 'italic', fontSize: '18px', color: '#333' }}>Estado Actual: <strong>Ciudadano</strong></p></IonText>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IonText><span style={{ fontStyle: 'italic', fontSize: '14px', color: '#333' }}>Acreditar Residencia</span></IonText>
                  <IonButton size="small" onClick={handleFileUpload} style={{ '--background': '#1b3a6b', '--border-radius': '6px' }}>Subir Archivo</IonButton>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;