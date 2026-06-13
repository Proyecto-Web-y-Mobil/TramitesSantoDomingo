import React, { useEffect } from 'react';
import { 
  IonPage, IonContent, IonButton, IonCard, IonCardContent 
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import FooterBanner from '../components/FooterBanner';
import HeaderBanner from '../components/HeaderBanner';
import ConstructionAlert from '../components/ConstructionAlert'; 
import { authService } from '../services/authService';

export default function TramitesPresenciales() {
  const history = useHistory();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await authService.verifySession();
      } catch (error) {
        authService.logout();
        history.push('/login');
      }
    };
    checkSession();
  }, [history]);

  const presenciales = [
    { titulo: "Licencia de Conducir (Clase B)", img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop", ruta: "/tramites-presenciales/licencia-b/info" },
    { titulo: "Renovación Cédula de Identidad", img: "https://images.unsplash.com/photo-1633265486064-086b219458ce?q=80&w=2070&auto=format&fit=crop" },
    { titulo: "Subsidio Familiar (SUF)", img: "https://images.unsplash.com/photo-1555252136-1161f369d7a2?q=80&w=2070&auto=format&fit=crop" },
    { titulo: "Registro Social de Hogares", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop" }
  ];

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <HeaderBanner 
            title="Agendamiento Presencial"
            backgroundImage="/assets/headerTramites.png"
            buttonText="Volver"
            buttonRoute="/tramites"
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 300px))', 
              gap: '20px',
              width: '100%',
              maxWidth: '1000px',
              justifyContent: 'center'
            }}>
              {presenciales.map((item, index) => {
                const CardContent = (
                  <IonCard style={{ margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: 'white', border: 'none', overflow: 'hidden', height: '100%' }}>
                    <div style={{ width: '100%', paddingTop: '65%', position: 'relative' }}>
                      <img src={item.img} alt={item.titulo} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <IonCardContent style={{ padding: '0', flex: 1 }}>
                      <IonButton 
                        expand="block" 
                        onClick={() => item.ruta ? history.push(item.ruta) : null}
                        style={{ '--background': '#1b3a6b', '--border-radius': '0', margin: '0', minHeight: '60px' }}
                      >
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'none', whiteSpace: 'normal' }}>
                          {item.titulo}
                        </span>
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                );

                return item.ruta ? (
                  <div key={index}>{CardContent}</div>
                ) : (
                  <ConstructionAlert key={index}>{CardContent}</ConstructionAlert>
                );
              })}
            </div>
          </main>
          <FooterBanner />
        </div>
      </IonContent>
    </IonPage>
  );
}