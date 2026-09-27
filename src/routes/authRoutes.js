const express = require("express");

const {
  registrarUsuario,
  iniciarSesion
} = require("../controllers/authController");

const verificarToken = require("../middleware/auth");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", iniciarSesion);

router.get("/perfil", verificarToken, (req, res) => {
  res.status(200).json({
    mensaje: "Token válido",
    usuario: req.user
  });
});

module.exports = router;