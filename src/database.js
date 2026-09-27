const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath =
  process.env.NODE_ENV === "test"
    ? ":memory:"
    : path.join(__dirname, "..", "donantes.db");

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error("Error al conectar con la base de datos:", error.message);
  } else {
    console.log("Base de datos conectada correctamente");
  }
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  db.run(
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'usuario'
        CHECK (rol IN ('administrador', 'usuario')),
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (error) => {
      if (error) {
        console.error("Error al crear la tabla usuarios:", error.message);
      } else {
        console.log("Tabla usuarios preparada");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS donantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE COLLATE NOCASE,
      telefono TEXT NOT NULL,
      tipo_sangre TEXT NOT NULL
        CHECK (
          tipo_sangre IN (
            'A+', 'A-',
            'B+', 'B-',
            'AB+', 'AB-',
            'O+', 'O-'
          )
        ),
      creado_por INTEGER,
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creado_por) REFERENCES usuarios(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
    )`,
    (error) => {
      if (error) {
        console.error("Error al crear la tabla donantes:", error.message);
      } else {
        console.log("Tabla donantes preparada");
      }
    }
  );
});

module.exports = db;