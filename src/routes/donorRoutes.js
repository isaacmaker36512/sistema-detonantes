const express = require("express");

const verificarToken = require("../middleware/auth");
const soloAdministrador = require("../middleware/roles");

const {
  registrarDonante,
  obtenerDonantes,
  actualizarDonante,
  eliminarDonante
} = require("../controllers/donorController");

const router = express.Router();

router.get("/", verificarToken, obtenerDonantes);
router.post("/", verificarToken, registrarDonante);
router.put("/:id", verificarToken, actualizarDonante);
router.delete(
  "/:id",
  verificarToken,
  soloAdministrador,
  eliminarDonante
);

module.exports = router;