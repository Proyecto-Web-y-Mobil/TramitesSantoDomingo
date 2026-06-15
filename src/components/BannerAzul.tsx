import React from 'react';

interface Props {
  titulo: string;
}

const BannerAzul: React.FC<Props> = ({ titulo }) => {
  return (
    <div style={{ 
      backgroundColor: '#0088d6', 
      padding: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      position: 'relative', 
      minHeight: '100px',
      width: '100%'
    }}>
      {/* Logo posicionado a la izquierda */}
      <img 
        src="/assets/logo.webp" 
        alt="Logo Municipalidad" 
        style={{ height: '70px', zIndex: 2 }} 
      />
      
      {/* Título centrado absolutamente respecto al contenedor */}
      <div style={{ 
        position: 'absolute', 
        width: '100%', 
        left: 0, 
        textAlign: 'center',
        pointerEvents: 'none' // Para que no interfiera con clics
      }}>
        <h2 style={{ 
          color: 'white', 
          margin: '0', 
          fontSize: '1.8rem', 
          fontWeight: 'bold',
          letterSpacing: '0.5px'
        }}>
          {titulo}
        </h2>
      </div>
    </div>
  );
};

export default BannerAzul;