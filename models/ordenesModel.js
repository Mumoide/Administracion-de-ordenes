const db = require('../database/db');

class OrdenesModel {


    static get(callback) {
        const sql = "SELECT id, numero_ficha, fecha_creacion, fecha_inicio_estado, fecha_entrega, fecha_envio, nombre_tipo, fecha_facturacion, nombre_ubicaciones, rut_doctor, nombre_trabajo, nombre_centro, nombre_etapas, id_estado, rut_usuario_asignado, usuario_id, usuario_email, usuario_activo, usuario_asignado, usuario_asignado_ape, usuario_asignado_rol_id, id_etapa, nombre_protesis, nombre_completitud, activo, etapa_activa FROM (SELECT tf.nombre_tipo, co.nombre_completitud, p.nombre_protesis, u.nombre_ubicaciones, o.id, o.numero_ficha, o.centro, o.rut_paciente, o.rut_doctor, o.fecha_creacion, tt.nombre_trabajo, c.nombre_centro,hoee.id_estado AS id_estado, ua.activo AS usuario_activo, ua.id AS usuario_id, ua.rut_usuario as rut_usuario_asignado, per.email as usuario_email, per.nombre as usuario_asignado, per.apellido as usuario_asignado_ape, per.rol_id as usuario_asignado_rol_id, e.nombre_etapas, hoee.id AS id_etapa, o.fecha_facturacion, hoee.fecha_entrega, hoee.fecha_envio, hoee.fecha_inicio_estado, ROW_NUMBER() OVER (PARTITION BY o.id ORDER BY hoee.activo DESC,hoee.fecha_inicio_estado DESC, hoee.id DESC, hoee.activo DESC) AS row_num, o.activo, hoee.activo AS etapa_activa FROM ordenes_de_trabajo o LEFT JOIN historial_ordenes_etapas_estados hoee ON o.id = hoee.id_orden JOIN tipo_trabajo tt ON o.tipo_trabajo = tt.id JOIN centros_hospitalarios c ON o.centro = c.id LEFT JOIN etapas e ON e.id = hoee.id_etapa JOIN ubicaciones u ON o.ubicacion = u.id JOIN protesis p ON p.id = o.protesis JOIN completitud co ON co.id = o.completitud JOIN tipo_factura tf ON o.tipo_factura = tf.id LEFT JOIN (SELECT id_orden, MAX(id) AS max_id FROM usuarios_asignados GROUP BY id_orden) ua_max ON o.id = ua_max.id_orden LEFT JOIN usuarios_asignados ua ON ua_max.max_id = ua.id LEFT JOIN usuarios us ON ua.rut_usuario = us.rut LEFT JOIN personas per on us.rut = per.rut) AS subquery WHERE row_num = 1 AND activo = 1 ORDER BY fecha_creacion DESC;";

        db.query(sql, (error, results) => {
            if (error) {
                console.error('Error al consultar la base de datos:', error);
                callback('Error al consultar la base de datos', null);
                return;
            }

            callback(null, results);
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT o.id,o.numero_ficha,o.fecha_creacion,o.rut_paciente,o.centro,o.protesis,o.tipo_trabajo,o.completitud,o.color,o.terminacion,o.indicaciones,o.ubicacion,o.licencia,o.tipo_factura,o.fecha_facturacion,o.rut_doctor,p.nombre AS doctor_name,p.apellido AS doctor_last_name, p2.nombre AS patient_name, p2.apellido AS patient_last_name, p2.fecha_nacimiento AS patient_birth_date ,c.nombre_color,co.nombre_completitud,pr.nombre_protesis,tt.nombre_trabajo,te.nombre_terminacion,ub.nombre_ubicaciones,l.nombre_licencia,ch.nombre_centro,tf.nombre_tipo FROM ordenes_de_trabajo o  JOIN personas p  ON o.rut_doctor = p.rut  JOIN personas p2  ON o.rut_paciente = p2.rut  JOIN color c ON o.color = c.id JOIN completitud co ON o.completitud = co.id JOIN centros_hospitalarios ch ON o.centro = ch.id JOIN protesis pr ON o.protesis = pr.id JOIN tipo_trabajo tt ON o.tipo_trabajo = tt.id JOIN terminacion te ON o.terminacion = te.id JOIN ubicaciones ub ON o.ubicacion = ub.id JOIN licencias l ON o.licencia = l.id JOIN tipo_factura tf ON o.tipo_factura = tf.id WHERE o.id = ? and o.activo = 1;`;
            db.query(sql, [id], (error, result) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                    return;
                }

                if (result.length === 0) {
                    resolve(null); // No se encontró la orden con el ID dado
                    return;
                }

                resolve(result[0]);
            });
        });
    }

    static create(ordenData, callback) {
        let doctorExists = false;
        let patientExists = false;
        let personaDoctorExists = false;
        let personaPatientExists = false;
        let isPatientDoctor = false;
        const {
            creationDate,
            fileNumber,
            patientName,
            patientLastName,
            patientRut,
            patientBirthDate,
            medicalCenter,
            doctorName,
            doctorLastName,
            doctorRut,
            workType,
            prothesis,
            completitude,
            stage,
            color,
            location,
            indications,
            billing,
            billingDate,
            licence,
        } = ordenData;

        new Promise((resolve, reject) => {
            const existDoctor = 'SELECT * FROM doctores WHERE rut = ?';
            db.query(existDoctor, [doctorRut], (error, results) => {
                if (error) {
                    console.error('Error al ejecutar la consulta existDoctor:', error);
                    callback({ message: 'Error al ejecutar la consulta.' }, null);
                    return;
                }

                if (results.length > 0) {
                    doctorExists = true;
                }
                resolve(results);
            })
        }).then(() => {
            return new Promise((resolve, reject) => {
                const existPatient = 'SELECT * FROM pacientes WHERE rut = ?';
                db.query(existPatient, [patientRut], (error, results) => {
                    if (error) {
                        console.error('Error al ejecutar la consulta existPatient:', error);
                        callback({ message: 'Error al ejecutar la consulta.' }, null);
                        return;
                    }

                    if (results.length > 0) {
                        patientExists = true;
                    }
                    resolve(results);
                })
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                const existPersonaPatient = 'SELECT * FROM personas WHERE rut = ?';
                db.query(existPersonaPatient, [patientRut], (error, results) => {
                    if (error) {
                        console.error('Error al ejecutar la consulta existPatient:', error);
                        callback({ message: 'Error al ejecutar la consulta.' }, null);
                        return;
                    }

                    if (results.length > 0) {
                        personaPatientExists = true;
                    }
                    resolve(results);
                })
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                const existPersonaDoctor = 'SELECT * FROM personas WHERE rut = ?';
                db.query(existPersonaDoctor, [doctorRut], (error, results) => {
                    if (error) {
                        console.error('Error al ejecutar la consulta existPatient:', error);
                        callback({ message: 'Error al ejecutar la consulta.' }, null);
                        return;
                    }

                    if (results.length > 0) {
                        personaDoctorExists = true;
                    }
                    resolve(results);
                })
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                const existFichaSql = 'SELECT * FROM ordenes_de_trabajo WHERE numero_ficha = ?';
                db.query(existFichaSql, [fileNumber], (error, fichaResults) => {
                    if (error) {
                        console.error('Error al ejecutar la consulta existFichaSql:', error);
                        callback({ message: 'Error al ejecutar la consulta.' }, null);
                        return;
                    }

                    if (fichaResults.length > 0) {
                        callback({ error: "orden existente", message: `Error, ya existe la orden número ${fileNumber}, debe ingresar un número distinto.` }, null);
                        return;
                    }
                    if (doctorRut === patientRut) {
                        isPatientDoctor = true;
                    }
                    const sqlDoctor = 'INSERT INTO doctores (rut) VALUES (?)';
                    const valuesDoctor = [doctorRut];
                    const sqlPatient = 'INSERT INTO pacientes (rut) VALUES (?)';
                    const valuesPatient = [patientRut];
                    const sqlPersonaDoctor = 'INSERT INTO personas (rut, nombre, apellido, rol_id) VALUES (?)';
                    const valuesPersonaDoctor = [doctorRut, doctorName, doctorLastName, 3];
                    const sqlPersonaPatient = 'INSERT INTO personas (rut, nombre, apellido, fecha_nacimiento, rol_id) VALUES (?)';
                    const valuesPersonaPatient = [patientRut, patientName, patientLastName, patientBirthDate, 5];
                    const sqlOrdenes = `INSERT INTO ordenes_de_trabajo (
                            fecha_creacion,
                            numero_ficha,
                            rut_paciente,
                            centro,
                            rut_doctor,
                            tipo_trabajo,
                            protesis,
                            completitud,
                            color,
                            ubicacion,
                            indicaciones,
                            tipo_factura,
                            fecha_facturacion,
                            licencia
                        ) VALUES (?)`;

                    const valuesO = [[
                        creationDate,
                        fileNumber,
                        patientRut,
                        medicalCenter,
                        doctorRut,
                        workType,
                        prothesis,
                        completitude,
                        color,
                        location,
                        indications,
                        billing,
                        billingDate,
                        licence
                    ]];

                    let ordenId; // Variable para almacenar el ID de la orden de trabajo

                    new Promise((resolve, reject) => {
                        if (!personaDoctorExists) {
                            db.query(sqlPersonaDoctor, [valuesPersonaDoctor], (error, result) => {
                                if (error) {
                                    console.error('Error al ejecutar la consulta de inserción en la tabla doctores:', error);
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            });
                        } else {
                            resolve();
                        }
                    }).then((result) => {
                        return new Promise((resolve, reject) => {
                            if (!personaPatientExists && !isPatientDoctor) {
                                db.query(sqlPersonaPatient, [valuesPersonaPatient], (error, result) => {
                                    if (error) {
                                        console.error('Error al ejecutar la consulta de inserción en la tabla pacientes:', error);
                                        reject(error);
                                    } else {
                                        ordenId = result.insertId; // Guardar el ID de la orden de trabajo
                                        resolve(result);
                                    }
                                });
                            } else {
                                resolve();
                            }
                        });
                    }).then((result) => {
                        return new Promise((resolve, reject) => {
                            if (!patientExists) {
                                db.query(sqlPatient, valuesPatient, (error, result) => {
                                    if (error) {
                                        console.error('Error al ejecutar la consulta de inserción de paciente en la tabla personas:', error);
                                        reject(error);
                                    } else {
                                        ordenId = result.insertId; // Guardar el ID de la orden de trabajo
                                        resolve(result);
                                    }
                                });
                            } else {
                                resolve();
                            }
                        });
                    }).then((result) => {
                        return new Promise((resolve, reject) => {
                            if (!doctorExists) {
                                db.query(sqlDoctor, valuesDoctor, (error, result) => {
                                    if (error) {
                                        console.error('Error al ejecutar la consulta de inserción de paciente en la tabla personas:', error);
                                        reject(error);
                                    } else {
                                        ordenId = result.insertId; // Guardar el ID de la orden de trabajo
                                        resolve(result);
                                    }
                                });
                            } else {
                                resolve();
                            }
                        });
                    })
                        .then((result) => {
                            return new Promise((resolve, reject) => {
                                db.query(sqlOrdenes, valuesO, (error, result) => {
                                    if (error) {
                                        console.error('Error al ejecutar la consulta de inserción en la tabla ordenes_de_trabajo:', error);
                                        reject(error);
                                    } else {
                                        ordenId = result.insertId; // Guardar el ID de la orden de trabajo
                                        resolve(result);
                                    }
                                });
                            });
                        })
                        .then((result) => {
                            const sqlHistorial = `INSERT INTO historial_ordenes_etapas_estados (id_orden, nro_ficha, id_etapa, fecha_inicio_estado) VALUES (?)`;
                            const valuesHistorial = [[
                                ordenId,
                                fileNumber,
                                stage,
                                new Date()
                            ]];

                            db.query(sqlHistorial, valuesHistorial, (error, result) => {
                                if (error) {
                                    console.error('Error al ejecutar la consulta de inserción en la tabla historial_ordenes_etapas_estados:', error);
                                    callback({ message: 'Error al crear el historial de trabajo.' }, null);
                                } else {
                                    callback(null, {
                                        message: 'Orden de trabajo creada exitosamente',
                                        ordenId: ordenId
                                    });
                                }
                            });
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            callback({ message: 'Error al crear la orden de trabajo.' }, null);
                        });
                });
            })
        })
    }

    static deleteOrden(id) {
        return new Promise((resolve, reject) => {
            const selectSql = 'SELECT rut_doctor, rut_paciente FROM ordenes_de_trabajo WHERE id = ?';
            db.query(selectSql, [id], (error, result) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                    return;
                }

                if (result.length === 0) {
                    const errorMessage = 'No se encontró la orden con el ID dado';
                    reject(new Error(errorMessage));
                    return;
                }
                const date = new Date();
                const sqlDelete = [date, id]
                // Eliminar los registros relacionados en la tabla historial_ordenes_etapas_estados
                const deleteHistorialSql = 'UPDATE historial_ordenes_etapas_estados SET activo = 0, ulti_fecha_cambio_act = ? WHERE id_orden = ?';
                db.query(deleteHistorialSql, sqlDelete, (error, result) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        reject(error);
                        return;
                    }

                    // Eliminar la orden de trabajo
                    const deleteOrdenSql = 'UPDATE ordenes_de_trabajo SET activo = 0, ulti_fecha_cambio_act = ? WHERE id = ?';
                    db.query(deleteOrdenSql, sqlDelete, (error, result) => {
                        if (error) {
                            console.error('Error executing query:', error);
                            reject(error);
                            return;
                        }

                        resolve(result.affectedRows);
                    });
                });
            });
        });
    }




    static update(orderId, orderData, callback) {
        const {
            creationDate,
            fileNumber,
            patientName,
            patientLastName,
            patientRut,
            patientBirthDate,
            medicalCenter,
            doctorName,
            doctorLastName,
            doctorRut,
            workType,
            prothesis,
            completitude,
            stage,
            color,
            location,
            billing,
            billingDate,
            indications,
            licence,
        } = orderData;

        const existOrderSql = 'SELECT * FROM ordenes_de_trabajo WHERE id = ?';
        db.query(existOrderSql, [orderId], (error, orderResult) => {
            if (error) {
                console.error('Error al ejecutar la consulta existOrderSql:', error);
                callback(error, null);
            } else if (orderResult.length === 0) {
                callback(new Error('La orden de trabajo no existe.'), null);
            } else {
                const existFileNumberSql = 'SELECT numero_ficha FROM ordenes_de_trabajo where id != ?';
                db.query(existFileNumberSql, [orderId], (error, fileNumberResult) => {
                    if (error) {
                        console.error('Error al ejecutar la consulta existFileNumberSql:', error);
                        callback(error, null);
                    } else {
                        let errorFound = false;
                        fileNumberResult.forEach((element) => {
                            if (element.numero_ficha === parseInt(fileNumber)) {
                                callback(new Error('El número de ficha ya existe.'), null);
                                errorFound = true;
                            }
                        });
                        if (errorFound) {
                            return; // Stop execution if error is found
                        }
                        const sqlPaciente = "UPDATE personas SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE rut = ?;";
                        const sqlDoctor = "UPDATE personas SET nombre = ?, apellido = ? WHERE rut = ?;";
                        const sqlOrden = "UPDATE ordenes_de_trabajo SET fecha_creacion =?, numero_ficha = ?,centro = ?,tipo_trabajo = ? , protesis = ? , completitud = ? ,color = ?, ubicacion = ?,indicaciones = ?,tipo_factura = ?,fecha_facturacion = ?,licencia = ? WHERE id = ?;"
                        const sqlHistorial = "UPDATE historial_ordenes_etapas_estados SET nro_ficha = ? where id_orden = ?";
                        const patientValues = [
                            patientName,
                            patientLastName,
                            patientBirthDate,
                            patientRut,
                        ]
                        db.query(sqlPaciente, patientValues, (err, result) => {
                            if (err) {
                                console.error("Error updating patient into personas table:", err);
                                callback(error, null);
                            }
                            const doctorValues = [
                                doctorName,
                                doctorLastName,
                                doctorRut,
                            ]
                            db.query(sqlDoctor, doctorValues, (err, result) => {
                                if (err) {
                                    console.error("Error updating doctor into personas table:", err);
                                    callback(error, null);
                                }
                                const orderValues = [
                                    creationDate,
                                    fileNumber,
                                    medicalCenter,
                                    workType,
                                    prothesis,
                                    completitude,
                                    color,
                                    location,
                                    indications,
                                    billing,
                                    billingDate,
                                    licence,
                                    orderId,
                                ]
                                db.query(sqlOrden, orderValues, (err, result) => {
                                    if (err) {
                                        console.error("Error updating into ordenes_de_trabajo table:", err);
                                        callback(error, null);
                                    }
                                    const historialValues = [
                                        fileNumber,
                                        orderId
                                    ]
                                    db.query(sqlHistorial, historialValues, (err, result) => {
                                        if (err) {
                                            console.error("Error updating into ordenes_de_trabajo table:", err);
                                            callback(error, null);
                                        }
                                        callback(null, orderId);
                                    })
                                })
                            })
                        })
                    }
                });

            }
        });
    }

    static assignUser(orderId, assignedUserRut, callback) {
        return new Promise((resolve, reject) => {
            const insertAssignedUserSql = 'INSERT INTO usuarios_asignados(id_orden, rut_usuario) VALUES (?);';
            const values = [orderId, assignedUserRut];
            const selectOrderSql = 'SELECT * FROM ordenes_de_trabajo WHERE id = ?';
            const selectUserSql = 'SELECT * FROM usuarios WHERE rut = ?';
            const selectAssignedUserSql = 'SELECT * FROM usuarios_asignados WHERE id_orden = ? and activo = 1';
            const updateAssignedUserSql = 'UPDATE usuarios_asignados SET activo = 0, ulti_fecha_cambio_act = ? WHERE id_orden = ?';
            const date = new Date();
            const updateValues = [date, orderId];
            db.query(selectOrderSql, orderId, (error, result) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                    return;
                }
                if (result.length === 0) {
                    console.error('No existe una orden de trabajo con el número de ficha ingresado');
                    reject(error);
                    return;
                }
                db.query(selectUserSql, assignedUserRut, (error, result) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        reject(error);
                        return;
                    }
                    if (assignedUserRut === "Sin asignar") {
                        db.query(updateAssignedUserSql, updateValues, (error, result) => {
                            if (error) {
                                console.error('Error executing query:', error);
                                reject(error);
                                return;
                            }
                        });
                        resolve("Se ha eliminado la asignación del usuario correctamente");
                        return;
                    }
                    db.query(selectAssignedUserSql, orderId, (error, result) => {
                        if (error) {
                            console.error('Error executing query:', error);
                            reject(error);
                            return;
                        }
                        if (result.length > 0) {
                            console.error('Ya existe un usuario asignado a la orden de trabajo');
                            db.query(updateAssignedUserSql, updateValues, (error, result) => {
                                if (error) {
                                    console.error('Error executing query:', error);
                                    reject(error);
                                    return;
                                }
                                db.query(insertAssignedUserSql, [values], (error, result) => {
                                    if (error) {
                                        console.error('Error executing query:', error);
                                        reject(error);
                                        return;
                                    }
                                    console.log('Usuario asignado correctamente');
                                });
                            });
                        } else {
                            db.query(insertAssignedUserSql, [values], (error, result) => {
                                if (error) {
                                    console.error('Error executing query:', error);
                                    reject(error);
                                    return;
                                }
                                resolve(result);
                                console.log('Usuario asignado correctamente');
                            });
                        }
                    });
                });
            });

        }).catch((error) => {
            console.error('Error al asignar usuario:', error);
            callback(error, null);
        });
    }

}




module.exports = OrdenesModel;
