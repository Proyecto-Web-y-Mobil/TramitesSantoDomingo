const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Librería de encriptación (EP 2.6)
const jwt = require('jsonwebtoken'); // Librería de tokens (EP 2.5)
require('dotenv').config();
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Secreto para el JWT (En producción debe estar en el archivo .env)
const JWT_SECRET = process.env.JWT_SECRET || 'llave_secreta_municipalidad_2026';

app.get('/api', (req, res) => {
  res.json({ status: 'success', message: 'Servidor Backend Municipal operativo y seguro.' });
});

// LOGIN SEGURO CON BCRYPT Y JWT
app.post('/api/auth/login', async (req, res) => {
  const { credential, password } = req.body;

  if (!credential || !password) {
    return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
  }

  try {
    // 1. Buscamos al usuario SOLO por RUT o Correo (No por contraseña)
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE rut = ? OR correo = ?',
      [credential, credential]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const user = rows[0];

    // 2. Comparamos la contraseña plana con el Hash indescifrable de la DB
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    // 3. Obtenemos el nombre del rol
    const [roles] = await pool.query(
      'SELECT nombre FROM roles WHERE id = ?',
      [user.id_rol]
    );
    const rol = roles[0]?.nombre || 'ciudadano';

    // 4. Generamos el Token JWT real (EP 2.5)
    const token = jwt.sign(
      { id: user.id, rut: user.rut, rol: rol },
      JWT_SECRET,
      { expiresIn: '2h' } // El token caduca en 2 horas por seguridad
    );

    res.json({
      message: 'Login exitoso',
      token: token, // Enviamos el JWT real
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

// REGISTRO SEGURO CON BCRYPT
app.post('/api/auth/register', async (req, res) => {
  const { rut, nombres, apellidoP, apellidoM, correo, password, region, comuna } = req.body;

  if (!rut || !correo || !password) {
    return res.status(400).json({ message: 'RUT, correo y contraseña son obligatorios.' });
  }

  try {
    const [existe] = await pool.query(
      'SELECT id FROM usuarios WHERE rut = ? OR correo = ?',
      [rut, correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: 'El usuario ya está registrado.' });
    }

    // Hasheamos la contraseña antes de guardarla (EP 2.6)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      `INSERT INTO usuarios 
        (nombres, apellido_p, apellido_m, rut, correo, region, comuna, password_hash, id_rol) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [nombres, apellidoP, apellidoM, rut, correo, region, comuna, hashedPassword] // Insertamos el Hash
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
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});