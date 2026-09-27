const db = require("../config/database");

const registrarDonante = (req, res) => {
  const { nombre, edad, tipo_sangre, telefono, correo } = req.body;

  if (!nombre || !edad || !tipo_sangre || !telefono || !correo) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios"
    });
  }

  const consulta = `
    INSERT INTO donantes
    (nombre, edad, tipo_sangre, telefono, correo)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    consulta,
    [nombre, edad, tipo_sangre, telefono, correo],
    function (error) {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al registrar al donante",
          error: error.message
        });
      }

      return res.status(201).json({
        mensaje: "Donante registrado correctamente",
        donante: {
          id: this.lastID,
          nombre,
          edad,
          tipo_sangre,
          telefono,
          correo
        }
      });
    }
  );
};

const obtenerDonantes = (req, res) => {
  db.all("SELECT * FROM donantes", [], (error, filas) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener los donantes",
        error: error.message
      });
    }

    return res.status(200).json({
      mensaje: "Lista de donantes",
      donantes: filas
    });
  });
};

module.exports = {
  registrarDonante,
  obtenerDonantes
};