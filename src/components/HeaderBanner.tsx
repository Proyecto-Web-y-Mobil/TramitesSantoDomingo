import React from 'react';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

interface HeaderBannerProps {
  title: string;
  backgroundImage: string;
  buttonText: string;
  buttonRoute: string;
  showSecondaryButton?: boolean;
}

const HeaderBanner: React.FC<HeaderBannerProps> = ({ 
  title, 
  backgroundImage, 
  buttonText, 
  buttonRoute, 
  showSecondaryButton = false 
}) => {
  const history = useHistory();

  return (
    <header
      style={{
        backgroundImage: `linear-gradient(rgba(68, 43, 146, 0.4), rgba(68, 43, 146, 0.4)), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 20px',
        color: 'white',
        minHeight: '250px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <IonGrid>
        <IonRow className="ion-align-items-center">
          <IonCol size="12" sizeMd="7">
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <img src="/assets/logo.webp" alt="Logo" style={{ height: '100px', width: 'auto' }} />
              <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', margin: 0 }}>{title}</h1> 
            </div>
          </IonCol>
          
          <IonCol size="12" sizeMd="5" style={{ textAlign: 'right' }}>
            {/* Contenedor flex para centrar el texto secundario bajo el botón */}
            <div style={{ 
              display: 'inline-flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              verticalAlign: 'middle' 
            }}>
              <IonButton 
                onClick={() => history.push(buttonRoute)}
                style={{ 
                  '--background': '#0088d6', 
                  '--border-radius': '6px', 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  height: '50px',
                  margin: 0
                }}
              >
                {buttonText}
              </IonButton>
              
              {showSecondaryButton && (
                <p 
                  onClick={() => history.push('/login-funcionario')}
                  style={{ 
                    fontSize: '0.9rem',
                    cursor: 'pointer', 
                    color: 'white',
                    textDecoration: 'underline',
                    margin: '10px 0 0 0',
                    textAlign: 'center'
                  }}
                >
                  Inicio Sesión Funcionarios
                </p>
              )}
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </header>
  );
};

export default HeaderBanner;