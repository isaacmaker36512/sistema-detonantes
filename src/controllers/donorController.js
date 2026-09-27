const db = require("../database");

const registrarDonante = (req, res) => {
  const { nombre, tipo_sangre, telefono, correo } = req.body;

  if (!nombre || !tipo_sangre || !telefono || !correo) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios"
    });
  }

  const consulta = `
    INSERT INTO donantes
    (nombre, tipo_sangre, telefono, correo, creado_por)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    consulta,
    [nombre, tipo_sangre, telefono, correo, req.user.id],
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
          tipo_sangre,
          telefono,
          correo,
          creado_por: req.user.id
        }
      });
    }
  );
};

const obtenerDonantes = (req, res) => {
  db.all("SELECT * FROM donantes", [], (error, donantes) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener los donantes",
        error: error.message
      });
    }

    return res.status(200).json({
      mensaje: "Lista de donantes",
      donantes
    });
  });
};

const actualizarDonante = (req, res) => {
  const { id } = req.params;
  const { nombre, tipo_sangre, telefono, correo } = req.body;

  if (!nombre || !tipo_sangre || !telefono || !correo) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios"
    });
  }

  const consulta = `
    UPDATE donantes
    SET nombre = ?, tipo_sangre = ?, telefono = ?, correo = ?
    WHERE id = ?
  `;

  db.run(
    consulta,
    [nombre, tipo_sangre, telefono, correo, id],
    function (error) {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al actualizar al donante",
          error: error.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          mensaje: "Donante no encontrado"
        });
      }

      return res.status(200).json({
        mensaje: "Donante actualizado correctamente"
      });
    }
  );
};

const eliminarDonante = (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM donantes WHERE id = ?",
    [id],
    function (error) {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al eliminar al donante",
          error: error.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          mensaje: "Donante no encontrado"
        });
      }

      return res.status(200).json({
        mensaje: "Donante eliminado correctamente"
      });
    }
  );
};

module.exports = {
  registrarDonante,
  obtenerDonantes,
  actualizarDonante,
  eliminarDonante
};