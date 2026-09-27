const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

const registrarUsuario = (req, res) => {
  let { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({
      mensaje: "Nombre, correo y contraseña son obligatorios"
    });
  }

  nombre = nombre.trim();
  correo = correo.trim().toLowerCase();

  if (nombre.length < 3) {
    return res.status(400).json({
      mensaje: "El nombre debe tener al menos 3 caracteres"
    });
  }

  if (!correo.includes("@")) {
    return res.status(400).json({
      mensaje: "El correo no es válido"
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      mensaje: "La contraseña debe tener al menos 8 caracteres"
    });
  }

  const buscarUsuario = `
    SELECT id
    FROM usuarios
    WHERE correo = ?
  `;

  db.get(buscarUsuario, [correo], async (error, usuarioExistente) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al consultar el usuario"
      });
    }

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado"
      });
    }

    try {
      const passwordCifrada = await bcrypt.hash(password, 10);

      const guardarUsuario = `
        INSERT INTO usuarios (nombre, correo, password, rol)
        VALUES (?, ?, ?, ?)
      `;

      db.run(
        guardarUsuario,
        [nombre, correo, passwordCifrada, "usuario"],
        function (error) {
          if (error) {
            return res.status(500).json({
              mensaje: "No fue posible registrar el usuario"
            });
          }

          return res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
              id: this.lastID,
              nombre,
              correo,
              rol: "usuario"
            }
          });
        }
      );
    } catch (error) {
      return res.status(500).json({
        mensaje: "Error al cifrar la contraseña"
      });
    }
  });
};

const iniciarSesion = (req, res) => {
  let { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({
      mensaje: "Correo y contraseña son obligatorios"
    });
  }

  correo = correo.trim().toLowerCase();

  const buscarUsuario = `
    SELECT id, nombre, correo, password, rol
    FROM usuarios
    WHERE correo = ?
  `;

  db.get(buscarUsuario, [correo], async (error, usuario) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al consultar el usuario"
      });
    }

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    try {
      const passwordCorrecta = await bcrypt.compare(
        password,
        usuario.password
      );

      if (!passwordCorrecta) {
        return res.status(401).json({
          mensaje: "Correo o contraseña incorrectos"
        });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          mensaje: "La clave JWT no está configurada"
        });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      return res.status(200).json({
        mensaje: "Inicio de sesión correcto",
        token,
        rol: usuario.rol,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo
        }
      });
    } catch (error) {
      return res.status(500).json({
        mensaje: "Error al iniciar sesión"
      });
    }
  });
};

module.exports = {
  registrarUsuario,
  iniciarSesion
};