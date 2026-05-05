import { useState } from 'react';
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

const cssVariables = `
  :root {
    --color-primario: #1a73c8;
    --color-secundario: #1b3a6b;
    --color-fondo: #f0f0f0;
    --color-blanco: #ffffff;
    --color-texto: #333333;
    --color-link: #1a73c8;
    --border-radius: 8px;
    --font-size-titulo: 24px;
    --font-size-label: 18px;
    --font-size-small: 14px;
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

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.click();
  };

  return (
    <IonPage>
      <style>{cssVariables}</style>

      {/* ── HEADER BANNER ── */}
      <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden' }}>
        {/* Imagen panorámica de fondo */}
        <img
          src="/assets/SantoDomingoPaisaje.jpg"
          alt="Santo Domingo"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
        />

        {/* Overlay semitransparente */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(27,58,107,0.75) 0%, rgba(27,58,107,0.35) 60%, transparent 100%)'
        }} />

        {/* Logo + Título */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          display: 'flex', alignItems: 'center', gap: '14px', padding: '0 20px'
        }}>
          <img
            src="/assets/logo.webp"
            alt="Logo Municipalidad"
            style={{ height: '56px', borderRadius: '4px' }}
          />
          <h1 style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: '700',
            margin: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            letterSpacing: '0.5px'
          }}>
            Perfil
          </h1>
        </div>

        {/* Foto de perfil esquina superior derecha */}
        <div style={{
          position: 'absolute', top: '12px', right: '16px',
          width: '72px', height: '72px',
          borderRadius: '50%',
          border: '3px solid #ffffff',
          overflow: 'hidden',
          background: '#d1d5db',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
        }}>
          <img
            src="/assets/IconoPerfil.png"
            alt="Foto de perfil"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Botones navegación abajo izquierda */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '20px',
          display: 'flex', gap: '10px'
        }}>
          <IonButton
            size="small"
            onClick={() => history.push('/tramites')}
            style={{
              '--background': '#1a73c8',
              '--border-radius': '6px',
              '--padding-start': '14px',
              '--padding-end': '14px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Mis Trámites
          </IonButton>
          <IonButton
            size="small"
            onClick={() => history.push('/agendas')}
            style={{
              '--background': '#1a73c8',
              '--border-radius': '6px',
              '--padding-start': '14px',
              '--padding-end': '14px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Mis Agendas
          </IonButton>
        </div>

        {/* Botón Modificar Perfil abajo derecha */}
        <div style={{
          position: 'absolute', bottom: '10px', right: '16px'
        }}>
          <IonButton
            size="small"
            onClick={() => setEditMode(!editMode)}
            style={{
              '--background': '#1b3a6b',
              '--border-radius': '6px',
              '--padding-start': '14px',
              '--padding-end': '14px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            {editMode ? 'Guardar Cambios' : 'Modificar Perfil'}
          </IonButton>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <IonContent style={{ '--background': '#f0f0f0' }}>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol sizeMd="7" sizeLg="6" sizeXl="5" size="12">

              {/* Nombre Completo */}
              <IonLabel>
                <p style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px', color: '#333333' }}>
                  Nombre Completo
                </p>
              </IonLabel>
              <IonItem style={{
                '--background': '#ffffff',
                '--border-radius': '8px',
                marginBottom: '12px'
              }}>
                <IonInput
                  placeholder=""
                  value={nombre}
                  readonly={!editMode}
                  onIonChange={e => setNombre(e.detail.value!)}
                />
              </IonItem>

              {/* RUT */}
              <IonLabel>
                <p style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px', color: '#333333' }}>
                  RUT
                </p>
              </IonLabel>
              <IonItem style={{
                '--background': '#ffffff',
                '--border-radius': '8px',
                marginBottom: '12px'
              }}>
                <IonInput
                  placeholder=""
                  value={rut}
                  readonly={!editMode}
                  onIonChange={e => setRut(e.detail.value!)}
                />
              </IonItem>

              {/* Correo Electrónico */}
              <IonLabel>
                <p style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px', color: '#333333' }}>
                  Correo Electrónico
                </p>
              </IonLabel>
              <IonItem style={{
                '--background': '#ffffff',
                '--border-radius': '8px',
                marginBottom: '12px'
              }}>
                <IonInput
                  type="email"
                  placeholder=""
                  value={correo}
                  readonly={!editMode}
                  onIonChange={e => setCorreo(e.detail.value!)}
                />
              </IonItem>

              {/* Región */}
              <IonLabel>
                <p style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px', color: '#333333' }}>
                  Región
                </p>
              </IonLabel>
              <IonItem style={{
                '--background': '#ffffff',
                '--border-radius': '8px',
                marginBottom: '12px'
              }}>
                <IonInput
                  placeholder=""
                  value={region}
                  readonly={!editMode}
                  onIonChange={e => setRegion(e.detail.value!)}
                />
              </IonItem>

              {/* Comuna */}
              <IonLabel>
                <p style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px', color: '#333333' }}>
                  Comuna
                </p>
              </IonLabel>
              <IonItem style={{
                '--background': '#ffffff',
                '--border-radius': '8px',
                marginBottom: '16px'
              }}>
                <IonInput
                  placeholder=""
                  value={comuna}
                  readonly={!editMode}
                  onIonChange={e => setComuna(e.detail.value!)}
                />
              </IonItem>

              {/* Estado + Acreditar Residencia */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '8px 0'
              }}>
                <IonText>
                  <p style={{
                    fontStyle: 'italic',
                    fontSize: '18px',
                    color: '#333333',
                    margin: 0
                  }}>
                    Estado Actual: <strong>Ciudadano</strong>
                  </p>
                </IonText>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IonText>
                    <span style={{
                      fontStyle: 'italic',
                      fontSize: '14px',
                      color: '#333333'
                    }}>
                      Acreditar Residencia en la comuna
                    </span>
                  </IonText>
                  <IonButton
                    size="small"
                    onClick={handleFileUpload}
                    style={{
                      '--background': '#1b3a6b',
                      '--border-radius': '6px',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}
                  >
                    Subir Archivo
                  </IonButton>
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
