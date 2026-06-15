import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import BannerFoto from '../components/BannerFoto';
import ConstructionAlert from '../components/ConstructionAlert';
import { authService } from '../services/authService';

const AdminDashboard: React.FC = () => {
  const history = useHistory();
  const [nombreAdmin, setNombreAdmin] = useState('Cargando...');

  useEffect(() => {
    const checkSession = async () => {
      try {
        await authService.verifySession();
        const session = localStorage.getItem('user_session');
        
        if (session) {
          const userObj = JSON.parse(session);
          const user = Array.isArray(userObj) ? userObj[0] : userObj;

          // 🔥 CANDADO CORREGIDO: Verificamos el texto exacto del rol
          if (user.rol !== 'funcionario') {
            history.replace('/tramites-user');
            return; 
          }

          setNombreAdmin(`${user.nombres} ${user.apellidoP}`);
        } else {
          history.push('/login-funcionario');
        }
      } catch (error) {
        authService.logout();
        history.push('/login-funcionario');
      }
    };
    checkSession();
  }, [history]);

  const handleCerrarSesion = () => {
    authService.logout();
    history.push('/login-funcionario');
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '40px 30px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.2s',
    marginBottom: '24px',
    border: '1px solid #e5e7eb',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#111',
    margin: 0,
  };

  return (
    <IonPage>
      {/* Banner modificado correctamente */}
      <div style={{ position: 'relative' }}>
        <BannerFoto titulo="Administrador" />

        {/* Subtítulo bienvenida sobre el banner */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '135px',
        }}>
          <p style={{
            color: '#ffffff',
            fontSize: '1.1rem',
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            fontStyle: 'italic'
          }}>
            Bienvenido: {nombreAdmin}
          </p>
        </div>

        {/* Botón Cerrar Sesión */}
        <div style={{ position: 'absolute', bottom: '10px', right: '16px' }}>
          <IonButton
            size="small"
            onClick={handleCerrarSesion}
            style={{
              '--background': '#1a73c8',
              '--border-radius': '6px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            Cerrar Sesión
          </IonButton>
        </div>
      </div>

      {/* Contenido principal con ConstructionAlert */}
      <IonContent style={{ '--background': '#f0f0f0' }}>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="9" sizeLg="8" sizeXl="7">
              <div style={{ padding: '32px 16px' }}>

              {/* Generar Reportes */}
                <div
                  style={cardStyle}
                  onClick={() => history.push('/admin/reportes')}
                  onMouseEnter={e => {                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <p style={cardTitleStyle}>Generar reportes</p>
                </div>

                {/* Trámites asignados */}
                <div
                  style={cardStyle}
                  onClick={() => history.push('/admin/tramites')}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <p style={cardTitleStyle}>Trámites asignados</p>
                </div>

                {/* Confirmaciones de Residencia */}
                <div
                  style={cardStyle}
                  onClick={() => history.push('/admin/residencias')}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <p style={cardTitleStyle}>Confirmaciones de residencia</p>
                </div>

              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;