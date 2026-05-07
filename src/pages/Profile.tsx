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
import BannerFoto from '../components/BannerFoto'; // Importamos el nuevo componente

const Profile = () => {
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      const user = JSON.parse(session);
      setUserData(user);
      setNombre(`${user.nombres} ${user.apellidoP} ${user.apellidoM}`);
      setRut(user.rut);
      setCorreo(user.correo);
      setRegion(user.region);
      setComuna(user.comuna);
    } else {
      history.push('/login');
    }
  }, [history]);

  if (!userData) return null;

  return (
    <IonPage>
      {/* LLAMADA AL COMPONENTE REUTILIZABLE */}
      <BannerFoto titulo="Perfil" />

      {/* Botón de modificación que queda fuera del componente por ser específico de esta página */}
      <div style={{ position: 'absolute', top: '100px', right: '16px', zIndex: 10 }}>
          <IonButton size="small" onClick={() => setEditMode(!editMode)} style={{ '--background': '#1b3a6b' }}>
            {editMode ? 'Guardar Cambios' : 'Modificar Perfil'}
          </IonButton>
      </div>

      <IonContent style={{ '--background': '#f0f0f0' }}>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="7" size="12">
              <br />
              {/* Resto de tus campos de información igual que siempre... */}
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
                <IonInput value={correo} readonly={!editMode} onIonChange={e => setCorreo(e.detail.value!)} />
              </IonItem>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <IonText>
                  <p style={{ fontStyle: 'italic', fontSize: '18px', color: '#333' }}>
                    Estado Actual: <strong>{userData.residente ? 'Residente' : 'Ciudadano'}</strong>
                  </p>
                </IonText>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <IonText><span style={{ fontSize: '14px', color: '#333' }}>Acreditar Residencia</span></IonText>
                   <IonButton size="small" style={{ '--background': '#1b3a6b' }}>Subir Archivo</IonButton>
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