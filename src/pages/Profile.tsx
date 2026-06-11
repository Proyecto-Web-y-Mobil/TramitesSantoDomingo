import { useState, useEffect, useRef } from 'react';
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
  useIonToast,
  IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import BannerFoto from '../components/BannerFoto';
import ConstructionAlert from '../components/ConstructionAlert';
import { authService } from '../services/authService';

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
  const [presentToast] = useIonToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userId, setUserId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const [correo, setCorreo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  
  // Extraemos el rol dinámicamente y el estado del documento
  const [rolUsuario, setRolUsuario] = useState('ciudadano');
  const [estadoDocumento, setEstadoDocumento] = useState('Sin subir'); 
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await authService.verifySession();
        const session = localStorage.getItem('user_session');
        if (session) {
          const userObj = JSON.parse(session);
          const user = Array.isArray(userObj) ? userObj[0] : userObj;
          
          setUserId(user.id);
          setNombre(`${user.nombres} ${user.apellidoP || user.apellido_p || ''} ${user.apellidoM || user.apellido_m || ''}`);
          setRut(user.rut);
          setCorreo(user.correo);
          setRegion(user.region);
          setComuna(user.comuna);
          
          // Leemos el rol oficial (ciudadano o residente)
          if (user.rol) setRolUsuario(user.rol.toLowerCase());
          
          // Si el backend ya mandara el estado del documento, lo leeríamos aquí:
          if (user.estado_validacion) setEstadoDocumento(user.estado_validacion);
          
          setIsLoaded(true);
        }
      } catch (error) {
        authService.logout();
        history.push('/login');
      }
    };
    checkSession();
  }, [history]);

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSubiendoArchivo(true);
    const formData = new FormData();
    formData.append('documento_residencia', file);
    formData.append('usuario_id', String(userId));

    try {
      const BACKEND_URL = 'https://tramitessantodomingo-production-5cb4.up.railway.app/api/usuarios/residencia';
      
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.ok) {
        presentToast({ message: 'Documento subido con éxito. En revisión.', duration: 3000, color: 'success' });
        setEstadoDocumento('En revisión');

        // 🔥 EL TRUCO: Actualizamos la memoria del navegador
        const sessionData = localStorage.getItem('user_session');
        if (sessionData) {
          let userObj = JSON.parse(sessionData);
          // Actualizamos el dato dependiendo de si es un array o un objeto
          if (Array.isArray(userObj)) {
            userObj[0].estado_validacion = 'En revisión';
          } else {
            userObj.estado_validacion = 'En revisión';
          }
          // Guardamos la "foto" actualizada
          localStorage.setItem('user_session', JSON.stringify(userObj));
        }

      } else {
        throw new Error(data.error || 'Error al subir documento');
      }
    } catch (error) {
      console.error(error);
      presentToast({ message: 'Hubo un error al conectar con el servidor.', duration: 3000, color: 'danger' });
    } finally {
      setSubiendoArchivo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isLoaded) return null;

  // Lógica visual dependiendo del rol
  const esResidente = rolUsuario === 'residente';

  return (
    <IonPage>
      <style>{cssVariables}</style>

      <div style={{ position: 'relative' }}>
        <BannerFoto titulo="Perfil" />

        <div style={{ position: 'absolute', bottom: '10px', left: '95px', display: 'flex', gap: '10px' }}>
          <div style={{ width: 'fit-content' }}>
            <IonButton
              size="small"
              onClick={() => history.push('/mis-tramites')}
              style={{ '--background': '#1a73c8', '--border-radius': '6px', fontSize: '13px', fontWeight: '600' }}
            >
              Mis Trámites
            </IonButton>
          </div>
          
          <ConstructionAlert>
            <div style={{ width: 'fit-content' }}>
              <IonButton
                size="small"
                style={{ '--background': '#1a73c8', '--border-radius': '6px', fontSize: '13px', fontWeight: '600' }}
              >
                Mis Agendas
              </IonButton>
            </div>
          </ConstructionAlert>
        </div>

        <div style={{ position: 'absolute', bottom: '10px', right: '16px' }}>
          <ConstructionAlert>
            <div style={{ width: 'fit-content' }}>
              <IonButton
                size="small"
                style={{ '--background': '#1a73c8', '--border-radius': '6px', fontSize: '13px', fontWeight: '600' }}
              >
                Agregar Foto
              </IonButton>
            </div>
          </ConstructionAlert>
        </div>
      </div>

      <IonContent style={{ '--background': '#f0f0f0' }}>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="7" sizeLg="6" size="12">
              <br />
              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>Nombre Completo</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '12px' }}>
                <IonInput value={nombre} readonly={true} />
              </IonItem>

              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>RUT</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '12px' }}>
                <IonInput value={rut} readonly={true} />
              </IonItem>

              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>Correo Electrónico</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '12px' }}>
                <IonInput type="email" value={correo} readonly={true} />
              </IonItem>

              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>Región</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '12px' }}>
                <IonInput value={region} readonly={true} />
              </IonItem>

              <IonLabel><p style={{ fontWeight: '600', fontSize: '18px', color: '#333' }}>Comuna</p></IonLabel>
              <IonItem style={{ '--border-radius': '8px', marginBottom: '16px' }}>
                <IonInput value={comuna} readonly={true} />
              </IonItem>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <IonText>
                  <p style={{ fontStyle: 'italic', fontSize: '18px', color: '#333' }}>
                    Estado Actual: <strong style={{ color: esResidente ? '#28a745' : '#333' }}>
                      {esResidente ? 'Residente' : 'Ciudadano'}
                    </strong>
                  </p>
                </IonText>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IonText>
                    <span style={{ fontStyle: 'italic', fontSize: '14px', color: esResidente ? '#28a745' : '#333' }}>
                      {esResidente ? 'Residencia Acreditada' : (estadoDocumento === 'En revisión' ? 'Documento en revisión' : 'Acreditar Residencia')}
                    </span>
                  </IonText>
                  
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileUpload}
                  />

                  <div style={{ width: 'fit-content' }}>
                    <IonButton 
                      size="small" 
                      onClick={triggerFileSelect}
                      disabled={subiendoArchivo || esResidente || estadoDocumento === 'En revisión'}
                      style={{ '--background': '#1b3a6b', '--border-radius': '6px' }}
                    >
                      {subiendoArchivo ? <IonSpinner name="dots" /> : 'Subir Archivo'}
                    </IonButton>
                  </div>
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