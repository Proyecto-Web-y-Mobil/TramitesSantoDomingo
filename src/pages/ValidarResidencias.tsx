import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonButton, IonSpinner, useIonToast, IonIcon, IonBadge
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { documentOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';
import HeaderBanner from '../components/HeaderBanner';

export default function ValidarResidencias() {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // 🔒 CANDADO DE SEGURIDAD PARA ADMINISTRADORES
  useEffect(() => {
    const verificarPermisosAdmin = () => {
      const sessionData = localStorage.getItem('user_session');
      
      // 1. Si no hay sesión en absoluto, lo mandamos al login de funcionarios
      if (!sessionData) {
        history.push('/login-funcionario');
        return;
      }

      const userObj = JSON.parse(sessionData);
      const user = Array.isArray(userObj) ? userObj[0] : userObj;

      // 2. Si hay sesión pero no dice exactamente 'funcionario', es un ciudadano intruso.
      // Lo expulsamos silenciosamente al menú de trámites logueado.
      if (user.rol !== 'funcionario') {
        history.replace('/tramites-user');
      }
    };

    verificarPermisosAdmin();
  }, [history]);

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {
    try {
      const response = await fetch('https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/residencias-pendientes');
      const data = await response.json();
      if (data.ok) {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      presentToast({ message: 'Error al cargar la lista', duration: 3000, color: 'danger' });
    } finally {
      setCargando(false);
    }
  };

  const procesarSolicitud = async (id: number, accion: 'aprobar' | 'rechazar') => {
    try {
      const url = `https://tramitessantodomingo-production-5cb4.up.railway.app/api/admin/residencias/${accion}/${id}`;
      const response = await fetch(url, { method: 'PUT' });
      const data = await response.json();

      if (data.ok) {
        presentToast({ 
          message: accion === 'aprobar' ? 'Residencia Aprobada' : 'Residencia Rechazada', 
          duration: 3000, 
          color: accion === 'aprobar' ? 'success' : 'warning' 
        });
        // Recargar la lista para que desaparezca el usuario procesado
        cargarPendientes();
      }
    } catch (error) {
      presentToast({ message: 'Error de conexión con el servidor', duration: 3000, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': '#f5f5f5' }}>
        <HeaderBanner 
          title="Validar Residencias"
          backgroundImage="/assets/headerAdmin.png"
          buttonText="Volver al Panel"
          buttonRoute="/admin-dashboard"
          showSecondaryButton={false} 
        />

        <main style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ color: '#1b3a6b', fontWeight: 'bold' }}>Solicitudes Pendientes</h2>
          
          {cargando ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}><IonSpinner /></div>
          ) : usuarios.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
              <h3>No hay solicitudes pendientes</h3>
              <p>Todos los documentos han sido revisados.</p>
            </div>
          ) : (
            usuarios.map((user) => (
              <IonCard key={user.id} style={{ marginBottom: '20px', borderRadius: '8px' }}>
                <IonCardHeader style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                  <IonCardTitle style={{ fontSize: '1.2rem', color: '#1b3a6b' }}>
                    {user.nombres} {user.apellido_p} {user.apellido_m}
                  </IonCardTitle>
                  <small style={{ color: '#666' }}>RUT: {user.rut} | Correo: {user.correo}</small>
                </IonCardHeader>

                <IonCardContent style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  
                  <IonButton 
                    fill="outline" 
                    color="primary" 
                    onClick={() => window.open(user.url_residencia, '_blank')}
                  >
                    <IonIcon slot="start" icon={documentOutline} />
                    Ver Documento
                  </IonButton>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <IonButton color="danger" onClick={() => procesarSolicitud(user.id, 'rechazar')}>
                      <IonIcon slot="start" icon={closeOutline} /> Rechazar
                    </IonButton>
                    
                    <IonButton color="success" onClick={() => procesarSolicitud(user.id, 'aprobar')}>
                      <IonIcon slot="start" icon={checkmarkOutline} /> Aprobar
                    </IonButton>
                  </div>

                </IonCardContent>
              </IonCard>
            ))
          )}
        </main>
      </IonContent>
    </IonPage>
  );
}