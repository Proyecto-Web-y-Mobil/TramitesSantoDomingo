import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSpinner,
  useIonToast
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import FooterBanner from '../components/FooterBanner';
import HeaderBanner from '../components/HeaderBanner';

export default function PermisoCirculacionForm() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  
  // Estados para guardar lo que escribe el usuario
  const [patente, setPatente] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);

  // Función que maneja la selección del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivo(e.target.files[0]);
    }
  };

  // Función que se ejecuta al presionar "Enviar Trámite"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patente || !marca || !modelo || !anio || !archivo) {
      presentToast({
        message: 'Por favor, completa todos los campos y adjunta tu documento.',
        duration: 3000,
        color: 'warning'
      });
      return;
    }

    setCargando(true);

    // 1. EXTRAEMOS AL USUARIO DEL LOCALSTORAGE
    const sessionData = localStorage.getItem('user_session');
    
    // Si no hay sesión, detenemos el envío
    if (!sessionData) {
      presentToast({
        message: 'Error: No se encontró una sesión activa. Vuelve a iniciar sesión.',
        duration: 4000,
        color: 'danger'
      });
      setCargando(false);
      return;
    }

    // Convertimos el texto a Javascript
    const usuarioLogeado = JSON.parse(sessionData);
    console.log("🕵️‍♂️ Datos guardados en memoria:", usuarioLogeado);

    // TRUCO: Verificamos si es un array o un objeto y extraemos los datos reales
    const datosReales = Array.isArray(usuarioLogeado) ? usuarioLogeado[0] : usuarioLogeado;

    // 2. ARMAMOS EL PAQUETE DE DATOS
    const formData = new FormData();
    
    // Inyectamos el ID real de forma segura
    formData.append('usuario_id', String(datosReales.id)); 
    formData.append('tramite_id', '1'); // El ID de tu trámite semilla
    formData.append('patente', patente);
    formData.append('marca', marca);
    formData.append('modelo', modelo);
    formData.append('anio', anio);
    formData.append('documento', archivo);

    try {
      // URL de producción
      const BACKEND_URL = 'http://localhost:3000/api/tramites/permiso-circulacion';

      const respuesta = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await respuesta.json();

      if (data.ok) {
        presentToast({
          message: '¡Trámite enviado con éxito! Su solicitud está en revisión.',
          duration: 4000,
          color: 'success'
        });
        // Volvemos al menú principal
        setTimeout(() => history.push('/tramites-user'), 2000);
      } else {
        throw new Error(data.error || 'Error al enviar');
      }

    } catch (error) {
      console.error(error);
      presentToast({
        message: 'Hubo un error al conectar con el servidor.',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          
          <HeaderBanner 
            title="Formulario de Renovación"
            backgroundImage="/assets/headerTramites.png"
            buttonText="Volver"
            buttonRoute="/tramite/permiso-circulacion/info"
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center' }}>
            <IonCard style={{ maxWidth: '600px', width: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
                <IonCardTitle style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  Datos del Vehículo
                </IonCardTitle>
              </IonCardHeader>

              <IonCardContent style={{ padding: '20px' }}>
                <form onSubmit={handleSubmit}>
                  
                  <IonItem style={{ marginBottom: '15px' }}>
                    <IonLabel position="stacked">Patente (Ej: AB-CD-12)</IonLabel>
                    <IonInput 
                      value={patente} 
                      onIonChange={e => setPatente(e.detail.value!)} 
                      placeholder="Ingrese la patente" 
                    />
                  </IonItem>

                  <IonItem style={{ marginBottom: '15px' }}>
                    <IonLabel position="stacked">Marca</IonLabel>
                    <IonInput 
                      value={marca} 
                      onIonChange={e => setMarca(e.detail.value!)} 
                      placeholder="Ej: Toyota" 
                    />
                  </IonItem>

                  <IonItem style={{ marginBottom: '15px' }}>
                    <IonLabel position="stacked">Modelo</IonLabel>
                    <IonInput 
                      value={modelo} 
                      onIonChange={e => setModelo(e.detail.value!)} 
                      placeholder="Ej: Yaris" 
                    />
                  </IonItem>

                  <IonItem style={{ marginBottom: '25px' }}>
                    <IonLabel position="stacked">Año de Fabricación</IonLabel>
                    <IonInput 
                      type="number"
                      value={anio} 
                      onIonChange={e => setAnio(e.detail.value!)} 
                      placeholder="Ej: 2024" 
                    />
                  </IonItem>

                  <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', color: '#1b3a6b', fontWeight: 'bold' }}>
                      Adjuntar Revisión Técnica (PDF o Imagen)
                    </label>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleFileChange}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <IonButton 
                    expand="block" 
                    type="submit" 
                    disabled={cargando}
                    style={{ '--background': '#28a745', fontWeight: 'bold', height: '50px' }}
                  >
                    {cargando ? <IonSpinner name="crescent" /> : 'Enviar Trámite'}
                  </IonButton>

                </form>
              </IonCardContent>
            </IonCard>
          </main>

          <FooterBanner />

        </div>
      </IonContent>
    </IonPage>
  );
}