const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");

const app = express();

// Base de datos
dbConnection();

// Lectura y parseo del body
app.use(express.json());

// CORS
app.use(cors());

app.use("/api/auth", require("./routes/auth"));

// Escuchar peticiones
app.listen(5000, () => {
  console.log(`Servidor corriendo en puerto 5000`);
});
