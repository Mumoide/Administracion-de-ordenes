const db = require('../database/db');
const sendPasswordResetEmail = require('../helpers/sendPasswordResetEmail');
const generateToken = require('../helpers/generateToken');
const bcrypt = require("bcrypt")
class LoginModel {
  static findByEmail(email, callback) {
    const sql = 'SELECT p.id,p.rut, u.password, p.email, p.rol_id, u.imagen, p.nombre FROM usuarios u JOIN personas p ON u.rut = p.rut WHERE p.email = ? and u.activo = 1;';
    db.query(sql, [email], (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        callback(error, null);
        return;
      }

      if (results.length === 0) {
        callback(null, null); // El usuario no existe
        return;
      }

      const user = results[0];
      callback(null, user);
    });
  }

  static forgotPassword(email, callback) {
    // Check if the email exists in the database
    const sql = 'SELECT u.rut FROM usuarios u JOIN personas p ON u.rut = p.rut where p.email = ? and u.activo = 1;';
    db.query(sql, [email], (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        callback(error, null);
        return;
      }

      if (results.length === 0) {
        callback("Correo ingresado no existe.", 404); // El usuario no existe
        return;
      }
      // Catch rut
      const rut = results[0].rut;
      // Generate a password reset token
      const resetToken = generateToken();
      // Generate the expiration date for the token
      const expires = new Date(Date.now() + 3600000 / 2); // 1 hour

      const year = expires.getFullYear();
      const month = String(expires.getMonth() + 1).padStart(2, "0");
      const day = String(expires.getDate()).padStart(2, "0");
      const hours = String(expires.getHours()).padStart(2, "0");
      const minutes = String(expires.getMinutes()).padStart(2, "0");
      const seconds = String(expires.getSeconds()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      // Generate values for the query
      const sqlValues = [resetToken, formattedDate, rut];
      // Save the reset token and the expiration date in the database for the user
      const sqlUserUpdate = 'UPDATE usuarios SET reset_token = ?, token_expiration_date = ? WHERE rut = ?';
      db.query(sqlUserUpdate, sqlValues, (err) => {
        if (err) throw err;
        // Send password reset email to the user
        sendPasswordResetEmail(email, resetToken);

        callback(null, { message: 'Correo para cambiar contraseña enviado.' });
      });
    });
  }


  // Reset password route
  static resetPassword({ email, token, password }, callback) {
    const sql = 'SELECT u.rut, u.token_expiration_date FROM usuarios u JOIN personas p ON u.rut = p.rut where p.email = ? and u.activo = 1;';
    // Check if the email and token match in the database
    db.query(sql, email, (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        callback(error, null);
        return;
      }

      if (results.length === 0) {
        callback("EL usuario no existe", 404); // El usuario no existe
        return;
      }
      if (results[0].token_expiration_date < Date.now()) {
        callback("Ya pasaron 30 minutos, el link enviado por correo expiró.", 404); // El token ya expiró
        return;
      }
      // Catch rut
      const rut = results[0].rut;
      // Generate a password reset token
      const sqlSelectUser = 'SELECT * FROM usuarios WHERE rut = ? AND reset_token = ?';
      const sqlValuesSelectUser = [rut, token];
      db.query(sqlSelectUser, sqlValuesSelectUser,
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            callback("Código incorrecto, intente restablecer nuevamente.", 404); // El usuario no existe
            return;
          }

          // Hash the new password
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;
            const sqlValuesUpdateUser = [hashedPassword, rut];
            const sqlUpdateUser = 'UPDATE usuarios SET password = ?, reset_token = NULL, token_expiration_date = NULL WHERE rut = ?';
            // Update the password in the database
            db.query(sqlUpdateUser, sqlValuesUpdateUser,
              (err) => {
                if (err) throw err;
                callback(null, { message: 'Contraseña restablecida.' });
              }
            );
          });
        }
      );
    })
  };
}


module.exports = LoginModel;
