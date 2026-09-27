const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Token no proporcionado"
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const datosUsuario = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = datosUsuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o vencido"
    });
  }
};

module.exports = verificarToken;