const API_URL = 'https://tramitessantodomingo-production.up.railway.app/api';

export const authService = {
  // 1. REGISTRO CONECTADO AL BACKEND (EP 2.4 / 2.5)
  register: async (userData: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Si el backend responde con un error (ej: usuario ya existe), lo capturamos aquí
      throw new Error(data.message || 'Error en el proceso de registro');
    }

    return data;
  },

  // 2. LOGIN CONECTADO AL BACKEND (EP 2.4 / 2.5)
  login: async (credential: string, pass: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ credential, password: pass })
    });

    const data = await response.json();

    if (!response.ok) {
      // Si las credenciales son incorrectas o faltan campos
      throw new Error(data.message || 'Credenciales inválidas');
    }

    // Cumpliendo con EP 2.5 y EP 2.6: Almacenamos el JWT y la sesión de usuario
    if (data.token) {
      localStorage.setItem('user_token', data.token);
      localStorage.setItem('user_session', JSON.stringify(data.user)); 
    }
    
    // Retornamos el objeto 'user' que contiene el 'rol' para que tus vistas manejen las redirecciones
    return data.user; 
  }
};
