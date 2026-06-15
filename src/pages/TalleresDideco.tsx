import React, { useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonCard, 
  IonCardContent 
} from "@ionic/react";
import { useHistory } from 'react-router-dom';
import FooterBanner from '../components/FooterBanner';
import HeaderBanner from '../components/HeaderBanner';
import ConstructionAlert from '../components/ConstructionAlert'; 
import { authService } from '../services/authService';

export default function TalleresDideco() {
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

  // Agregamos la propiedad 'route' solo al taller que queremos que funcione
  const talleres = [
    { titulo: "Arteterapia", img: "/assets/arte.png" },
    { titulo: "Zumba", img: "/assets/zumba.png", route: "/talleres/zumba" },
    { titulo: "Folklore", img: "/assets/folklore.png" },
    { titulo: "Cocina Saludable", img: "/assets/cocina.png" },
    { titulo: "Yoga 3ra edad", img: "/assets/yoga.png" },
    { titulo: "Fútbol Femenino", img: "/assets/futbol.png" },
  ];

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>

          {/* Banner superior con botón a Perfil */}
          <HeaderBanner 
            title="Talleres"
            backgroundImage="/assets/headtalleres.png"
            buttonText="Mi Perfil"
            buttonRoute="/profile"
            showSecondaryButton={false} 
          />

          <main style={{ flex: 1, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 300px))', 
              gap: '20px',
              width: '100%',
              maxWidth: '1000px',
              justifyContent: 'center'
            }}>
              {talleres.map((item, index) => {
                
                // Extraemos la tarjeta a una constante para no repetir código
                const TarjetaTaller = (
                  <IonCard style={{ 
                    margin: '0 auto', 
                    width: '100%',
                    display: 'flex', 
                    flexDirection: 'column', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    backgroundColor: 'white',
                    border: 'none',
                    overflow: 'hidden',
                    height: '100%'
                  }}>
                    <div style={{ width: '100%', paddingTop: '85%', position: 'relative' }}>
                      <img 
                        src={item.img} 
                        alt={item.titulo} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <IonCardContent style={{ padding: '0', flex: 1 }}>
                      <IonButton 
                        expand="block" 
                        onClick={() => {
                          // Si tiene una ruta válida (Zumba), navegamos hacia ella
                          if (item.route) {
                            history.push(item.route);
                          }
                        }}
                        style={{ '--background': '#1b3a6b', '--border-radius': '0', margin: '0', minHeight: '60px' }}
                      >
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'none', whiteSpace: 'normal' }}>
                          {item.titulo}
                        </span>
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                );

                // Si el taller tiene la propiedad 'route', NO lo envolvemos en la alerta
                if (item.route) {
                  return <React.Fragment key={index}>{TarjetaTaller}</React.Fragment>;
                }

                // Para todos los demás, mantenemos el ConstructionAlert original
                return (
                  <ConstructionAlert key={index}>
                    {TarjetaTaller}
                  </ConstructionAlert>
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