const USERS_KEY = 'usuarios_registrados';

const DEFAULT_FUNCIONARIO = {
  nombres: 'Admin',
  apellidoP: 'Municipal',
  apellidoM: '',
  rut: '11111111-1',
  correo: 'admin@municipalidad.cl',
  password: 'admin123',
  rol: 'funcionario'
};

const initDefaultUsers = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const exists = users.find((u: any) => u.rut === DEFAULT_FUNCIONARIO.rut);
  if (!exists) {
    users.push(DEFAULT_FUNCIONARIO);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

// Inicializar al cargar
initDefaultUsers();

export const authService = {
  register: (userData: any) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const exists = users.find((u: any) => u.rut === userData.rut || u.correo === userData.correo);
    if (exists) throw new Error('El usuario ya está registrado');
    users.push(userData);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  login: (credential: string, pass: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => 
      (u.rut === credential || u.correo === credential) && u.password === pass
    );
    if (user) {
      localStorage.setItem('user_session', JSON.stringify(user));
      return user;
    }
    return null;
  }
};
