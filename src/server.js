require("dotenv").config();

const app = require("./app");
require("./database");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});