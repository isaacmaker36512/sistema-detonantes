const soloAdministrador = (req, res, next) => {
  if (!req.user || req.user.rol !== "administrador") {
    return res.status(403).json({
      mensaje: "Acceso exclusivo para administradores"
    });
  }

  next();
};

module.exports = soloAdministrador;