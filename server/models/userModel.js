const db = require('../database/db');

const bcrypt = require("bcrypt")

class Persona {
  constructor(rut, imagen, name, lastName, birthDate, adress, phone, email, nombre_rol, rol_id) {
    this.rut = rut;
    this.name = name;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.adress = adress;
    this.phone = phone;
    this.email = email;
    this.nombre_rol = nombre_rol;
    this.imagen = imagen;
    this.rol_id = rol_id;
  }

  static getAll(callback) {
    const sql = 'SELECT r.nombre_rol, p.nombre, p.apellido, u.imagen, p.email, p.id, p.rut FROM personas p JOIN roles r ON p.rol_id = r.id JOIN usuarios u on u.rut = p.rut WHERE u.activo = 1;';
    db.query(sql, (error, results) => {
      if (error) throw error;
      callback(results);
    });
  }

  static getAllForExport(callback) {
    const sql = 'SELECT p.id, p.rut, p.nombre, p.apellido, p.fecha_nacimiento, p.direccion, p.celular, p.email, r.nombre_rol FROM personas p JOIN roles r ON p.rol_id = r.id JOIN usuarios u on u.rut = p.rut WHERE u.activo != 0;';
    db.query(sql, (error, results) => {
      if (error) throw error;
      // console.log("model", results)
      callback(null, results);
    });
  }

  static getById(id, callback) {
    const sql = "SELECT * FROM personas p JOIN usuarios u ON p.rut = u.rut WHERE p.id = ? and u.activo = 1;";
    db.query(sql, [id], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const persona = new Persona(
          results[0].rut,
          results[0].imagen,
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
          callback({ error: "rut existente", message: `Ya existe el rut número ${rut}, debe ingresar un rut distinto.` });
          return;
        } else if (existingData.email === email) {
          callback({ error: "email existente", message: `Ya existe el correo ${email}, debe ingresar un correo distinto.` });
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
        role,
        image,
        phone,
        password } = personaData;
      const otherUsers = 'SELECT * FROM personas WHERE id != ?';
      const sqlPersonas = 'UPDATE personas SET nombre=?, apellido=?, fecha_nacimiento=?, direccion=?, celular=?, email=?, rol_id=?  WHERE rut=?';
      const sqlUsuarios = 'UPDATE usuarios SET password=?, imagen=? WHERE rut=?';
      const valuesP = [name, lastName, birthDate, address, phone, email, role, rut];
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
            bcrypt.hash(password, 10, (error, hashedPass) => {
              if (error) {
                console.error('Error al aplicar el hash al password:', error);
                return;
              }
              db.query(sqlPersonas, valuesP, (error, result) => {
                if (error) {
                  console.error('Error al ejecutar la consulta de personas:', error);
                  db.rollback(() => {
                    reject(error);
                  });
                } else {
                  const valuesU = [hashedPass, image, rut];
                  db.query(sqlUsuarios, valuesU, (error, result) => {
                    if (error) {
                      console.error('Error al ejecutar la consulta de usuarios:', error);
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
              })
            });
          }
        });
      })
    });
  }

  static updateNoPass(personaData, id) {
    return new Promise((resolve, reject) => {
      const { name,
        lastName,
        rut,
        email,
        birthDate,
        address,
        role,
        image,
        phone } = personaData;
      const otherUsers = 'SELECT * FROM personas WHERE id != ?';
      const sqlPersonas = 'UPDATE personas SET nombre=?, apellido=?, fecha_nacimiento=?, direccion=?, celular=?, email=?, rol_id=?  WHERE rut=?';
      const sqlUsuarios = 'UPDATE usuarios SET imagen=? WHERE rut=?';


      const valuesP = [name, lastName, birthDate, address, phone, email, role, rut];
      const valuesU = [image, rut];
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
                db.query(sqlUsuarios, valuesU, (error, result) => {
                  if (error) {
                    console.error('Error al ejecutar la consulta de usuarios:', error);
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
            })
          }
        });
      });
    }

    );
  }

  static delete(rut, callback) {
    const existSql = 'SELECT * FROM usuarios WHERE rut = ?';
    db.query(existSql, [rut], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        callback('Usuario no encontrado');
        return;
      }
      const date = new Date();
      const sqlUsuarios = 'UPDATE usuarios SET activo = 0, ulti_fecha_cambio_act = ?  WHERE rut = ?';
      const sqlPersonas = 'UPDATE personas SET activo = 0, ulti_fecha_cambio_act = ? WHERE rut = ?';

      const sqlData = [date, rut];
      db.query(sqlUsuarios, sqlData, (error) => {
        // Verificar si el usuario existe antes de eliminarlo
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
