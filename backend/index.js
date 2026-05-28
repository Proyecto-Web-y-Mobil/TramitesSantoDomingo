const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint de verificación
app.get('/api', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Servidor Backend Municipal operativo con base de datos.' 
  });
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { credential, password } = req.body;

  if (!credential || !password) {
    return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE (rut = ? OR correo = ?) AND password_hash = ?',
      [credential, credential, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const user = rows[0];

    // Obtener nombre del rol
    const [roles] = await pool.query(
      'SELECT nombre FROM roles WHERE id = ?',
      [user.id_rol]
    );

    const rol = roles[0]?.nombre || 'ciudadano';

    res.json({
      message: 'Login exitoso',
      token: 'jwt_token_simulado_ep2',
      user: {
        rut: user.rut,
        correo: user.correo,
        nombres: user.nombres,
        apellidoP: user.apellido_p,
        apellidoM: user.apellido_m,
        region: user.region,
        comuna: user.comuna,
        rol: rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// REGISTRO
app.post('/api/auth/register', async (req, res) => {
  const { rut, nombres, apellidoP, apellidoM, correo, password, region, comuna } = req.body;

  if (!rut || !correo || !password) {
    return res.status(400).json({ message: 'RUT, correo y contraseña son obligatorios.' });
  }

  try {
    // Verificar si ya existe
    const [existe] = await pool.query(
      'SELECT id FROM usuarios WHERE rut = ? OR correo = ?',
      [rut, correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: 'El usuario ya está registrado.' });
    }

    // Insertar nuevo usuario con rol ciudadano (id_rol = 1)
    await pool.query(
      `INSERT INTO usuarios 
        (nombres, apellido_p, apellido_m, rut, correo, region, comuna, password_hash, id_rol) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [nombres, apellidoP, apellidoM, rut, correo, region, comuna, password]
    );

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      user: { rut, correo, rol: 'ciudadano' }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
