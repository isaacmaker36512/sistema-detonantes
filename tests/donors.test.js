const request = require("supertest");
const app = require("../src/app");
const db = require("../src/database");

const numero = Date.now();
const correoUsuario = `donante${numero}@email.com`;
const passwordUsuario = "Clave1234";

let tokenUsuario;
let tokenAdministrador;
let donanteId;

describe("Pruebas del módulo de donantes", () => {
  beforeAll(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Usuario para donantes",
        correo: correoUsuario,
        password: passwordUsuario
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        correo: correoUsuario,
        password: passwordUsuario
      });

    tokenUsuario = login.body.token;
  });

  test("Debe impedir el acceso sin token", async () => {
    const respuesta = await request(app).get("/api/donors");

    expect(respuesta.statusCode).toBe(401);
  });

  test("Debe rechazar un donante con campos vacíos", async () => {
    const respuesta = await request(app)
      .post("/api/donors")
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .send({});

    expect(respuesta.statusCode).toBe(400);
  });

  test("Debe registrar un donante", async () => {
    const respuesta = await request(app)
      .post("/api/donors")
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .send({
        nombre: "Donante de prueba",
        tipo_sangre: "O+",
        telefono: "6671234567",
        correo: `persona${numero}@email.com`
      });

    expect(respuesta.statusCode).toBe(201);
    expect(respuesta.body.donante).toHaveProperty("id");

    donanteId = respuesta.body.donante.id;
  });

  test("Debe obtener la lista de donantes", async () => {
    const respuesta = await request(app)
      .get("/api/donors")
      .set("Authorization", `Bearer ${tokenUsuario}`);

    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body.donantes)).toBe(true);
  });

  test("Debe actualizar un donante", async () => {
    const respuesta = await request(app)
      .put(`/api/donors/${donanteId}`)
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .send({
        nombre: "Donante actualizado",
        tipo_sangre: "A+",
        telefono: "6679876543",
        correo: `actualizado${numero}@email.com`
      });

    expect(respuesta.statusCode).toBe(200);
  });

  test("Debe impedir que un usuario elimine donantes", async () => {
    const respuesta = await request(app)
      .delete(`/api/donors/${donanteId}`)
      .set("Authorization", `Bearer ${tokenUsuario}`);

    expect(respuesta.statusCode).toBe(403);
  });

  test("Debe permitir que un administrador elimine donantes", async () => {
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE usuarios SET rol = ? WHERE correo = ?",
        ["administrador", correoUsuario],
        error => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        correo: correoUsuario,
        password: passwordUsuario
      });

    tokenAdministrador = login.body.token;

    const respuesta = await request(app)
      .delete(`/api/donors/${donanteId}`)
      .set("Authorization", `Bearer ${tokenAdministrador}`);

    expect(respuesta.statusCode).toBe(200);
  });
});