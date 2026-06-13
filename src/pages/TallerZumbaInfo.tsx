import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel, IonSpinner, useIonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { calendarOutline, timeOutline, locationOutline, checkmarkCircleOutline, arrowForwardOutline, arrowBackOutline, peopleOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';
import FooterBanner from '../components/FooterBanner';

export default function TallerZumbaInfo() {
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [usuario, setUsuario] = useState<any>(null);

  const [taller, setTaller] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  // Variables para la fecha formateada
  const [fechaTexto, setFechaTexto] = useState('');
  const [horarioTexto, setHorarioTexto] = useState('');

  useEffect(() => {
  const sessionData = localStorage.getItem('user_session');
  if (sessionData) {
    const userObj = JSON.parse(sessionData);
    setUsuario(Array.isArray(userObj) ? userObj[0] : userObj);
  }
  cargarTaller();
}, []);

  const cargarTaller = async () => {
    try {
      // Pedimos el taller con ID 1
      const response = await fetch('https://tramitessantodomingo-production-5cb4.up.railway.app/api/dideco/talleres/1');
      const data = await response.json();
      
      if (data.ok) {
        setTaller(data.taller);
        formatearFechas(data.taller.fecha_taller);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      presentToast({ message: 'Error al cargar la información del taller', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const formatearFechas = (fechaString: string) => {
    if (!fechaString) return;

    const fechaObj = new Date(fechaString);
    
    // Agregamos timeZone: 'UTC' para evitar que JS reste 4 horas por la zona de Chile
    const opcionesFecha: Intl.DateTimeFormatOptions = { 
      timeZone: 'UTC',
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setFechaTexto(fechaObj.toLocaleDateString('es-CL', opcionesFecha));

    // Forzamos formato 24 horas y bloqueamos el cambio de zona horaria
    const opcionesHora: Intl.DateTimeFormatOptions = { 
      timeZone: 'UTC',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    };
    const horaInicio = fechaObj.toLocaleTimeString('es-CL', opcionesHora);

    // Sumar 2 horas (en milisegundos) para la hora de término
    const fechaTermino = new Date(fechaObj.getTime() + 2 * 60 * 60 * 1000);
    const horaTermino = fechaTermino.toLocaleTimeString('es-CL', opcionesHora);

    setHorarioTexto(`${horaInicio} - ${horaTermino} hrs`);
  };

  if (cargando) {
    return <IonPage><IonContent><div style={{ textAlign: 'center', marginTop: '50px' }}><IonSpinner /></div></IonContent></IonPage>;
  }

  if (!taller) return null;

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#f5f5f5' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          <HeaderBanner 
            title="Talleres DIDECO"
            backgroundImage="/assets/headerTramites.png" 
            buttonText="Volver a Talleres"
            buttonRoute="/talleres" 
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ marginBottom: '10px' }}>
              <IonIcon slot="start" icon={arrowBackOutline} /> Volver
            </IonButton>

            <IonCard style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
              <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" alt="Clase de Zumba" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
              
              <IonCardHeader style={{ backgroundColor: '#1b3a6b', color: 'white' }}>
                <IonCardTitle style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>{taller.nombre}</IonCardTitle>
                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Departamento de Desarrollo Comunitario (DIDECO)</p>
              </IonCardHeader>

              <IonCardContent style={{ padding: '20px', fontSize: '1.1rem', color: '#333' }}>
                <p style={{ marginBottom: '20px', lineHeight: '1.6', textTransform: 'capitalize' }}>
                  {taller.descripcion}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <IonIcon icon={calendarOutline} style={{ color: '#1b3a6b', fontSize: '1.5rem', marginBottom: '5px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Fecha del Evento</h4>
                    <p style={{ margin: 0, textTransform: 'capitalize' }}>{fechaTexto}</p>
                  </div>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <IonIcon icon={timeOutline} style={{ color: '#1b3a6b', fontSize: '1.5rem', marginBottom: '5px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Horario</h4>
                    <p style={{ margin: 0 }}>{horarioTexto}</p>
                  </div>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <IonIcon icon={peopleOutline} style={{ color: '#1b3a6b', fontSize: '1.5rem', marginBottom: '5px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Cupos Disponibles</h4>
                    <p style={{ margin: 0, color: taller.cupos_disponibles > 5 ? 'inherit' : '#dc3545', fontWeight: 'bold' }}>
                      {taller.cupos_disponibles} de {taller.cupos_totales}
                    </p>
                  </div>
                </div>

                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '30px', color: '#1b3a6b' }}>Requisitos de Inscripción</h3>
                <IonList lines="none" style={{ backgroundColor: 'transparent' }}>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                    <IonLabel className="ion-text-wrap">Ser mayor de 18 años y residente de la comuna.</IonLabel>
                  </IonItem>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                    <IonLabel className="ion-text-wrap">Uso obligatorio de ropa deportiva y zapatillas adecuadas.</IonLabel>
                  </IonItem>
                  <IonItem style={{ '--background': 'transparent' }}>
                    <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                    <IonLabel className="ion-text-wrap">Salud compatible con actividad física aeróbica intensa.</IonLabel>
                  </IonItem>
                </IonList>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                {(() => {
                    // Si no hay cupos, botón bloqueado
                    if (taller.cupos_disponibles <= 0) {
                    return (
                        <IonButton color="medium" size="large" expand="block" disabled>
                        Cupos Agotados
                        </IonButton>
                    );
                    }
                    
                    // Si es ciudadano (Rol 1), botón bloqueado
                    if (usuario && usuario.id_rol === 1) {
                    return (
                        <IonButton color="warning" size="large" expand="block" disabled>
                        Debes validar tu residencia para inscribirte
                        </IonButton>
                    );
                    }

                    // Si es admin (Rol 3), botón bloqueado
                    if (usuario && usuario.id_rol === 3) {
                    return (
                        <IonButton color="medium" size="large" expand="block" disabled>
                        Uso exclusivo para ciudadanos
                        </IonButton>
                    );
                    }

                    // Si es residente (Rol 2) y hay cupos, botón habilitado
                    return (
                    <IonButton 
                        color="primary" 
                        size="large" 
                        expand="block"
                        onClick={() => history.push('/talleres/zumba/inscripcion')}
                    >
                        Ir al Formulario de Inscripción <IonIcon slot="end" icon={arrowForwardOutline} />
                    </IonButton>
                    );
                })()}
                </div>

              </IonCardContent>
            </IonCard>
          </main>
          <FooterBanner />
        </div>
      </IonContent>
    </IonPage>
  );
}