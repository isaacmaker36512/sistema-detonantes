const request = require("supertest");
const app = require("../src/app");

const numero = Date.now();
const correoPrueba = `usuario${numero}@email.com`;
const passwordPrueba = "Clave1234";

describe("Pruebas de autenticación", () => {
  test("Debe rechazar un registro con campos vacíos", async () => {
    const respuesta = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "",
        correo: "",
        password: ""
      });

    expect(respuesta.statusCode).toBe(400);
  });

  test("Debe registrar un usuario", async () => {
    const respuesta = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Usuario de prueba",
        correo: correoPrueba,
        password: passwordPrueba
      });

    expect(respuesta.statusCode).toBe(201);
    expect(respuesta.body).toHaveProperty("mensaje");
  });

  test("Debe impedir correos duplicados", async () => {
    const respuesta = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "Usuario duplicado",
        correo: correoPrueba,
        password: passwordPrueba
      });

    expect(respuesta.statusCode).toBe(409);
  });

  test("Debe rechazar una contraseña incorrecta", async () => {
    const respuesta = await request(app)
      .post("/api/auth/login")
      .send({
        correo: correoPrueba,
        password: "PasswordIncorrecto"
      });

    expect(respuesta.statusCode).toBe(401);
  });

  test("Debe iniciar sesión y generar un token", async () => {
    const respuesta = await request(app)
      .post("/api/auth/login")
      .send({
        correo: correoPrueba,
        password: passwordPrueba
      });

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body).toHaveProperty("token");
    expect(respuesta.body).toHaveProperty("rol");
  });
});