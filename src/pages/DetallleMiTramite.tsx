import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonSpinner, useIonToast, IonIcon, IonBadge, IonInput, IonItem, IonLabel
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { documentOutline, arrowBackOutline, cloudUploadOutline, saveOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';

export default function DetalleMiTramite() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentToast] = useIonToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tramite, setTramite] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);

  // Estados para los campos editables
  const [editPatente, setEditPatente] = useState('');
  const [editMarca, setEditMarca] = useState('');
  const [editModelo, setEditModelo] = useState('');
  const [editAnio, setEditAnio] = useState('');

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  const cargarDetalle = async () => {
    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/tramites/detalle/${id}`);
      const data = await response.json();
      if (data.ok) {
        setTramite(data.tramite);
        // Precargamos los estados editables con la info actual
        setEditPatente(data.tramite.patente || '');
        setEditMarca(data.tramite.marca || '');
        setEditModelo(data.tramite.modelo || '');
        setEditAnio(data.tramite.anio || '');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      presentToast({ message: 'Error al cargar el detalle', duration: 3000, color: 'danger' });
      history.goBack();
    } finally {
      setCargando(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setArchivoSeleccionado(event.target.files[0]);
    }
  };

  const enviarCorreccion = async () => {
    if (!editPatente || !editMarca || !editModelo || !editAnio) {
      presentToast({ message: 'Todos los campos de texto son obligatorios', duration: 3000, color: 'warning' });
      return;
    }

    setProcesando(true);
    const formData = new FormData();
    formData.append('patente', editPatente);
    formData.append('marca', editMarca);
    formData.append('modelo', editModelo);
    formData.append('anio', editAnio);
    
    // El archivo es opcional en la corrección
    if (archivoSeleccionado) {
      formData.append('documento', archivoSeleccionado);
    }

    try {
      const response = await fetch(`https://tramitessantodomingo-production-5cb4.up.railway.app/api/tramites/${id}/corregir`, {
        method: 'PUT',
        body: formData,
      });
      
      const data = await response.json();
      if (data.ok) {
        presentToast({ message: 'Corrección enviada con éxito', duration: 3000, color: 'success' });
        history.push('/mis-tramites'); 
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      presentToast({ message: 'Error al enviar la corrección', duration: 3000, color: 'danger' });
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) return <IonPage><IonContent><div style={{ textAlign: 'center', marginTop: '50px' }}><IonSpinner /></div></IonContent></IonPage>;
  if (!tramite) return null;

  const requiereModificacion = tramite.estado === 'observado' || tramite.estado === 'requiere modificación';

  return (
    <IonPage>
      <IonContent style={{ '--background': '#f5f5f5' }}>
        <HeaderBanner 
          title={`Detalle Solicitud #${tramite.solicitud_id}`}
          backgroundImage="/assets/headerTramites.png"
          buttonText="Volver a Mis Trámites"
          buttonRoute="/mis-tramites"
          showSecondaryButton={false} 
        />

        <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          
          <IonButton fill="clear" onClick={() => history.goBack()} style={{ marginBottom: '10px' }}>
            <IonIcon slot="start" icon={arrowBackOutline} /> Volver
          </IonButton>

          <IonCard style={{ borderRadius: '8px', marginBottom: '20px' }}>
            <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
              <IonCardTitle style={{ color: 'white', fontSize: '1.4rem' }}>{tramite.nombre_tramite}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent style={{ padding: '20px' }}>
              
              {/* MENSAJE DE OBSERVACIÓN */}
              {requiereModificacion && (
                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #ffc107', marginBottom: '20px' }}>
                  <h3 style={{ color: '#856404', marginTop: 0 }}>Se requieren modificaciones</h3>
                  <p style={{ color: '#856404', margin: 0 }}><strong>Mensaje del Admin:</strong> {tramite.observacion}</p>
                  <p style={{ color: '#856404', fontSize: '0.9rem', marginTop: '10px' }}><i>* Puedes corregir los datos del vehículo a continuación o subir un nuevo documento si fue solicitado.</i></p>
                </div>
              )}

              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: 0, color: '#1b3a6b' }}>Datos del Vehículo</h3>
                
                {requiereModificacion ? (
                  /* VISTA DE EDICIÓN */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    <IonItem lines="full">
                      <IonLabel position="stacked">Patente</IonLabel>
                      <IonInput value={editPatente} onIonChange={e => setEditPatente(e.detail.value!)} />
                    </IonItem>
                    <IonItem lines="full">
                      <IonLabel position="stacked">Marca</IonLabel>
                      <IonInput value={editMarca} onIonChange={e => setEditMarca(e.detail.value!)} />
                    </IonItem>
                    <IonItem lines="full">
                      <IonLabel position="stacked">Modelo</IonLabel>
                      <IonInput value={editModelo} onIonChange={e => setEditModelo(e.detail.value!)} />
                    </IonItem>
                    <IonItem lines="full">
                      <IonLabel position="stacked">Año</IonLabel>
                      <IonInput type="number" value={editAnio} onIonChange={e => setEditAnio(e.detail.value!)} />
                    </IonItem>
                  </div>
                ) : (
                  /* VISTA DE SOLO LECTURA */
                  <>
                    <p><strong>Patente:</strong> <IonBadge color="dark">{tramite.patente}</IonBadge></p>
                    <p><strong>Marca / Modelo:</strong> {tramite.marca} - {tramite.modelo}</p>
                    <p><strong>Año:</strong> {tramite.anio}</p>
                  </>
                )}
              </div>

              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <IonButton fill="outline" color="primary" onClick={() => window.open(tramite.url_revision_tecnica, '_blank')}>
                  <IonIcon slot="start" icon={documentOutline} /> Ver Documento Actual
                </IonButton>
              </div>

              {/* ZONA DE ACTUALIZACIÓN DE ARCHIVO Y BOTÓN GUARDAR */}
              {requiereModificacion && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  
                  <IonButton fill="outline" color="medium" expand="block" onClick={() => fileInputRef.current?.click()}>
                    <IonIcon slot="start" icon={cloudUploadOutline} />
                    {archivoSeleccionado ? archivoSeleccionado.name : 'Subir un nuevo documento (Opcional)'}
                  </IonButton>

                  <IonButton color="success" expand="block" disabled={procesando} onClick={enviarCorreccion}>
                    {procesando ? <IonSpinner name="dots" /> : <><IonIcon slot="start" icon={saveOutline} /> Guardar y Enviar Corrección</>}
                  </IonButton>
                </div>
              )}

            </IonCardContent>
          </IonCard>
        </main>
      </IonContent>
    </IonPage>
  );
}