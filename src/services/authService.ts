const API_URL = 'http://localhost:3000/api';

export const authService = {
  register: async (userData: any) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en el registro');
    return data;
  },

  login: async (credential: string, pass: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, password: pass })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Credenciales inválidas');

    if (data.token) {
      localStorage.setItem('user_token', data.token);
      localStorage.setItem('user_session', JSON.stringify(data.user)); 
    }
    return data.user; 
  },

  // Valida el token contra la ruta protegida del servidor
  verifySession: async () => {
    const token = localStorage.getItem('user_token');
    if (!token) throw new Error('No hay token de sesión local');

    const response = await fetch(`${API_URL}/dashboard/datos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Inyectamos el Token JWT aquí
      }
    });

    if (!response.ok) {
      throw new Error('Token expirado o inválido');
    }
    return await response.json();
  },

  // Limpia la sesión del navegador
  logout: () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_session');
  }
};