const USERS_KEY = 'usuarios_registrados';

export const authService = {
  // Guarda un usuario nuevo en el localStorage
  register: (userData: any) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Verificar si el RUT o Correo ya existe
    const exists = users.find((u: any) => u.rut === userData.rut || u.correo === userData.correo);
    if (exists) throw new Error('El usuario ya está registrado');

    users.push(userData);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Valida las credenciales para iniciar sesión
  login: (credential: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => 
      (u.rut === credential || u.correo === credential) && u.password === pass
    );
    
    if (user) {
      // Guardamos la sesión activa
      localStorage.setItem('user_session', JSON.stringify(user));
      return user;
    }
    return null;
  }
};