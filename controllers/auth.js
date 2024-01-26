const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const { response } = require("express");

const crearUsuario = async (req, res = response) => {
  console.log("asdsa", req.body);
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, name: usuario.name },
      "this-is-secret"
    );

    res.status(201).json({
      ok: true,
      id: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  console.log("req", req.body);
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, name: usuario.name },
      "this-is-secret"
    );

    res.json({
      ok: true,
      id: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const publications = (req, res) => {
  console.log("req", req.headers);

  res.json({
    ok: true,
  });
};

module.exports = {
  loginUsuario,
  crearUsuario,
  publications,
};
