const db = require('../database/db');

const bcrypt = require("bcrypt")

class Persona {
  constructor(rut, name, lastName, birthDate, adress, phone, email, nombre_rol, rol_id) {
    this.rut = rut;
    this.name = name;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.adress = adress;
    this.phone = phone;
    this.email = email;
    this.nombre_rol = nombre_rol;
    this.rol_id = rol_id;
  }



  static getAll(callback) {
    const sql = "SELECT p.rut, p.email, p.id, p.nombre, p.apellido, r.nombre_rol, p.rol_id FROM personas p LEFT JOIN doctores d ON d.rut = p.rut JOIN roles r ON d.rol_id = r.id WHERE p.activo = 1 UNION SELECT p.rut, p.email, p.id, p.nombre, p.apellido, r.nombre_rol, p.rol_id FROM personas p RIGHT JOIN doctores d ON d.rut = p.rut JOIN roles r ON d.rol_id = r.id WHERE p.activo = 1 UNION SELECT p.rut, p.email, p.id, p.nombre, p.apellido, r.nombre_rol, p.rol_id FROM personas p RIGHT JOIN pacientes d ON d.rut = p.rut JOIN roles r ON d.rol_id = r.id WHERE p.activo = 1 UNION SELECT p.rut, p.email, p.id, p.nombre, p.apellido, r.nombre_rol, p.rol_id FROM personas p RIGHT JOIN pacientes d ON d.rut = p.rut JOIN roles r ON d.rol_id = r.id WHERE p.activo = 1";
    db.query(sql, (error, results) => {
      if (error) throw error;
      callback(results);
    });
  }

  static getAllForExport(callback) {
    const sql = 'SELECT p.id, p.rut,p.nombre, p.apellido, p.fecha_nacimiento, r.nombre_rol, p.email, p.direccion, p.celular FROM personas p LEFT JOIN doctores d ON d.rut = p.rut JOIN roles r ON d.rol_id = r.id WHERE p.activo = 1 UNION SELECT p.id, p.rut,p.nombre, p.apellido, p.fecha_nacimiento, r.nombre_rol, p.email, p.direccion, p.celular FROM personas p RIGHT JOIN doctores d ON d.rut = p.rut JOIN roles r ON d.rol_id = r.id WHERE p.activo = 1 UNION SELECT p.id, p.rut,p.nombre, p.apellido, p.fecha_nacimiento, r.nombre_rol, p.email, p.direccion, p.celular FROM personas p RIGHT JOIN pacientes d ON d.rut = p.rut JOIN roles r ON d.rol_id = r.id WHERE p.activo = 1 UNION SELECT p.id, p.rut,p.nombre, p.apellido, p.fecha_nacimiento, r.nombre_rol, p.email, p.direccion, p.celular FROM personas p RIGHT JOIN pacientes d ON d.rut = p.rut JOIN roles r ON d.rol_id = r.id WHERE p.activo = 1;';
    db.query(sql, (error, results) => {
      if (error) throw error;
      // console.log("model", results)
      callback(null, results);
    });
  }

  static getById(id, callback) {
    const sql = "SELECT * FROM personas WHERE id = ? and activo = 1;";
    db.query(sql, [id], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const persona = new Persona(
          results[0].rut,
          results[0].nombre,
          results[0].apellido,
          results[0].fecha_nacimiento,
          results[0].direccion,
          results[0].celular,
          results[0].email,
          results[0].rol_id
        );
        callback(persona);
      } else {
        callback(null);
      }
    });
  }

  static getDoctorByRut(id, callback) {
    const sql = "SELECT p.*, r.nombre_rol FROM doctores d JOIN personas p ON d.rut = p.rut JOIN roles r on r.id = p.rol_id WHERE p.rut = ? and p.activo = 1;";
    db.query(sql, [id], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const persona = new Persona(
          results[0].rut,
          results[0].nombre,
          results[0].apellido,
          results[0].fecha_nacimiento,
          results[0].direccion,
          results[0].celular,
          results[0].email,
          results[0].nombre_rol,
          results[0].rol_id
        );
        callback(persona);
      } else {
        callback(null);
      }
    });
  }

  static getPatientByRut(id, callback) {
    const sql = "SELECT p.*, r.nombre_rol FROM pacientes d JOIN personas p ON d.rut = p.rut JOIN roles r on r.id = p.rol_id WHERE p.rut = ? and p.activo = 1;";
    db.query(sql, [id], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const persona = new Persona(
          results[0].rut,
          results[0].nombre,
          results[0].apellido,
          results[0].fecha_nacimiento,
          results[0].direccion,
          results[0].celular,
          results[0].email,
          results[0].nombre_rol,
          results[0].rol_id
        );
        callback(persona);
      } else {
        callback(null);
      }
    });
  }

  static create(personaData, callback) {
    const { name, lastName, rut, email, birthDate, address, password, confirmPassword, role, image, phone } = personaData;
    const existSql = 'SELECT * FROM personas WHERE rut = ? OR email = ?';
    db.query(existSql, [rut, email], (error, results) => {
      if (error) {
        callback(error);
        return;
      }

      if (results.length > 0) {
        const existingData = results[0];
        if (existingData.rut === rut) {
          callback({ error: "rut existente", message: `Error, ya existe el rut número ${rut}, debe ingresar un rut distinto.` });
          return;
        } else if (existingData.email === email) {
          callback({ error: "email existente", message: `Error, ya existe el correo ${email}, debe ingresar un correo distinto.` });
          return;
        }
      }
      const sqlUsuarios = 'INSERT INTO usuarios (rut, password, imagen) VALUES (?, ?, ?)';
      const sqlPersonas = 'INSERT INTO personas (rut, nombre, apellido, fecha_nacimiento, direccion, celular, email, rol_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

      const valuesP = [rut, name, lastName, birthDate, address, phone, email, role];

      bcrypt.hash(password, 10, (error, hashedPass) => {
        if (error) {
          console.error('Error al aplicar el hash al password:', error);
          return;
        }

        const valuesU = [rut, hashedPass, image];

        // console.log('Password hasheado:', hashedPass);

        new Promise((resolve, reject) => {
          db.query(sqlPersonas, valuesP, (error, result) => {
            if (error) {
              console.error('Error al ejecutar la query de inserción de personas:', error);
              reject(error);
            } else {
              resolve(result);
            }
          });
        })
          .then((result) => {
            return new Promise((resolve, reject) => {
              db.query(sqlUsuarios, valuesU, (error, result) => {
                if (error) {
                  console.error('Error al ejecutar la query de inserción de usuarios:', error);
                  reject(error);
                } else {
                  resolve(result);
                }
              });
            });
          })
          .then((result) => {
            callback(null, result.insertId);
          })
          .catch((error) => {
            console.error('Error:', error);
            callback(error);
          });
      });
    });
  }



  static update(personaData, id) {
    return new Promise((resolve, reject) => {
      const { name,
        lastName,
        rut,
        email,
        birthDate,
        address,
        phone } = personaData;
      const otherUsers = 'SELECT * FROM personas WHERE id != ?';
      const sqlPersonas = 'UPDATE personas SET nombre=?, apellido=?, fecha_nacimiento=?, direccion=?, celular=?, email=?  WHERE rut=?';
      const valuesP = [name, lastName, birthDate, address, phone, email, rut];
      db.beginTransaction((error) => {
        if (error) {
          console.error('Error al iniciar la transacción:', error);
          reject(error);
          return;
        }
        db.query(otherUsers, id, (error, otherPersonas) => {
          let errorFound = false;
          if (error) {
            console.error('Error al ejecutar la consulta de personas:', error);
            db.rollback(() => {
              reject(error);
            });
          } else {
            otherPersonas.forEach((element) => {
              if (email) {
                if (element.email === email) {
                  reject(new Error('El email proporcionado ya existe.'), null);
                  errorFound = true;
                }
              }
            });
            if (errorFound) {
              return;
            }
            db.query(sqlPersonas, valuesP, (error, result) => {
              if (error) {
                console.error('Error al ejecutar la consulta de personas:', error);
                db.rollback(() => {
                  reject(error);
                });
              } else {
                db.commit((error) => {
                  if (error) {
                    console.error('Error al confirmar la transacción:', error);
                    db.rollback(() => {
                      reject(error);
                    });
                  } else {
                    resolve(result);
                  }
                });
              }
            });
          }
        });
      });
    })
  };


  static delete(data, callback) {
    const existSql = 'SELECT * FROM personas WHERE rut = ?';
    let sqlRelacionado;
    // Verificar si la persona existe antes de eliminarla
    db.query(existSql, data.id, (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        callback('Usuario no encontrado');
        return;
      }
      const date = new Date();
      if (data.rol_id === "3") {
        sqlRelacionado = 'UPDATE doctores SET activo = 0, ulti_fecha_cambio_act = ?  WHERE rut = ?';
      }
      else if (data.rol_id === "5") {
        sqlRelacionado = 'UPDATE pacientes SET activo = 0, ulti_fecha_cambio_act = ? WHERE rut = ?';
      }
      const sqlPersonas = 'UPDATE personas SET activo = 0, ulti_fecha_cambio_act = ? WHERE rut = ?';

      const sqlData = [date, data.id];

      db.query(sqlRelacionado, sqlData, (error) => {
        if (error) throw error;
        // El usuario existe, proceder a eliminarlo
        db.query(sqlPersonas, sqlData, (error) => {
          if (error) throw error;
          callback(null, 'Usuario eliminado correctamente');
        });
      });
    });
  }








}


module.exports = Persona;
