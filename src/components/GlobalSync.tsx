import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function GlobalSync() {
  // useLocation detecta cada vez que la URL (página) cambia
  const location = useLocation();

  useEffect(() => {
    const sessionData = localStorage.getItem('user_session');
    
    if (sessionData) {
      const userObj = JSON.parse(sessionData);
      const user = Array.isArray(userObj) ? userObj[0] : userObj;

      if (user && user.id) {
        // Consultamos silenciosamente al servidor
        fetch(`http://localhost:3000/api/usuarios/${user.id}/sincronizar`)
          .then(res => res.json())
          .then(data => {
            if (data.ok) {
              // Actualizamos la memoria global
              user.estado_validacion = data.data.estado_validacion;
              user.rol = data.data.rol;
              user.id_rol = data.data.id_rol;
              
              localStorage.setItem('user_session', JSON.stringify(Array.isArray(userObj) ? [user] : user));
              
              // Disparamos un evento para que las páginas activas se enteren y se redibujen
              window.dispatchEvent(new Event('sesion_actualizada'));
            }
          })
          .catch(e => console.log('Error en sincronización global', e));
      }
    }
  }, [location.pathname]); // Se dispara cada vez que el usuario navega a otra ruta

  return null; // Es completamente invisible en la pantalla
}