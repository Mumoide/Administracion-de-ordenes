const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret_key = process.env.SECRET_KEY;

const LoginModel = require('../models/LoginModel');

class LoginController {
  static login(req, res, next) {
    const { email, password } = req.body;

    LoginModel.findByEmail(email, (error, user) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        res.status(404).json({ message: 'Usuario o Contraseña incorrecto.' });
        return;
      }
      const imagen = user.imagen;
      const nombre = user.nombre;
      const id = user.id;
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          console.error('Error al comparar contraseñas:', error);
          return next(error);
        }

        if (!result) {
          res.status(401).json({ message: 'Usuario o Contraseña incorrecto.' });
          return;
        }

        function generarToken(email, rol_id, imagen, nombre, id) {
          const payload = {
            email: email,
            rol_id: rol_id,
            imagen: imagen,
            nombre: nombre,
            id: id,
          };
          const token = jwt.sign(payload, secret_key, { expiresIn: '1d' });
          return token;
        }

        const tokenUsuario = generarToken(email, user.rol_id, imagen, nombre, id);
        res.cookie('token', tokenUsuario, {
          maxAge: 86400000, httpOnly: true,
          sameSite: "None", // Set SameSite attribute to None
          secure: true,
        });

        res.json({ Status: "Success", token: tokenUsuario });
      });
    });
  }

  static logout(req, res, next) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: "None",
      secure: true
    });
    res.json({ Status: "Success", message: "Logout exitoso" });
  }

  static forgotPassword(req, res, next) {
    const { email } = req.body;

    new Promise((resolve, reject) => {
      LoginModel.forgotPassword(email, (error, user) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(user);
      });
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Usuario no existe.' });
          return;
        }
        res.json({ message: 'Email enviado' });
      })
      .catch((error) => {
        res.status(500).json({ message: error });
        if (error) {
          console.error('Error al ejecutar la consulta:', error);
          return;
        }
      });
  }


  static resetPassword(req, res, next) {
    const { email, token, password } = req.body;
    new Promise((resolve, reject) => {
      LoginModel.resetPassword({ email, token, password }, (error, user) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(user);
      });
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Usuario no existe.' });
          return;
        }
        res.json({ message: 'Contraseña restablecida' });
      })
      .catch((error) => {
        if (res.status === 404) {
          res.status(404).json({ message: error });
          console.error('Error al ejecutar la consulta:', error);
          return;
        }
        res.status(500).json({ message: error });
        if (error) {
          console.error('Error al ejecutar la consulta:', error);
          return;
        }
      });
  };

}
module.exports = LoginController;
