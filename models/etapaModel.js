const db = require('../database/db');

class Etapas {
  static getAllEtapas(id_orden) {
    return new Promise((resolve, reject) => {
      const selectFirstRow = `select hoee.*, es.nombre_estados, et.nombre_etapas from historial_ordenes_etapas_estados hoee join etapas et on hoee.id_etapa = et.id join estados es on hoee.id_estado = es.id where hoee.id_orden = (?) and hoee.activo = (?) ORDER BY hoee.id DESC,hoee.activo DESC,hoee.fecha_inicio_estado DESC LIMIT 1;`;
      const selectExceptFirstRow = "SELECT hoee.*, nombre_estados, nombre_etapas FROM (SELECT hoee.*, es.nombre_estados, et.nombre_etapas, ROW_NUMBER() OVER (ORDER BY hoee.id DESC,hoee.activo DESC, hoee.fecha_inicio_estado DESC) AS row_num FROM historial_ordenes_etapas_estados hoee JOIN etapas et ON hoee.id_etapa = et.id JOIN estados es ON hoee.id_estado = es.id WHERE hoee.id_orden = (?) AND hoee.activo = 1) hoee WHERE hoee.row_num > 1;"
      db.query(selectFirstRow, [id_orden], (error, firstRowResult) => {
        if (error) {
          reject(error);
        } else {
          db.query(selectExceptFirstRow, [id_orden], (error, otherRowsResult) => {
            if (error) {
              reject(error);
            } else {
              resolve([firstRowResult, otherRowsResult]);
            }
          });
        }
      });
    });
  }

  static getAllEtapasForExport(id_orden) {
    return new Promise((resolve, reject) => {
      const selectAll = `select hoee.*, es.nombre_estados, et.nombre_etapas from historial_ordenes_etapas_estados hoee join etapas et on hoee.id_etapa = et.id join estados es on hoee.id_estado = es.id where hoee.id_orden = (?) and activo = 1 ORDER BY hoee.activo DESC,hoee.fecha_inicio_estado DESC, hoee.id DESC, hoee.activo;`;
      db.query(selectAll, id_orden, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }


  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT hoee.*, e.nombre_estados, et.nombre_etapas FROM historial_ordenes_etapas_estados hoee JOIN estados e ON hoee.id_estado = e.id JOIN etapas et ON hoee.id_etapa = et.id WHERE hoee.id = ? and activo = 1;';

      db.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  };

  static createEtapa(etapaData) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO historial_ordenes_etapas_estados(id_orden, nro_ficha, id_etapa, id_estado, fecha_envio, fecha_entrega, fecha_inicio_estado, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const date = new Date();
      console.log(date)
      const values = [
        etapaData.id_orden,
        etapaData.nro_ficha,
        etapaData.id_etapa,
        etapaData.id_estado,
        etapaData.fecha_envio,
        etapaData.fecha_entrega,
        date,
        etapaData.descripcion
      ];

      db.query(query, values, (error, results) => {
        if (error) {
          reject({ message: "Error en sql de la consulta getUser", Error: error });
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  static updateEtapa(etapaData) {
    return new Promise((resolve, reject) => {
      const { id, descripcion, fecha_entrega, fecha_envio, fecha_inicio_estado, id_estado, id_etapa, id_orden, nro_ficha } = etapaData;
      const query = 'UPDATE historial_ordenes_etapas_estados SET descripcion = ?, fecha_entrega = ?, fecha_envio = ?, fecha_inicio_estado = ?, id_estado = ?, id_etapa = ?, id_orden = ?, nro_ficha = ? WHERE id = ?';
      const values = [descripcion, fecha_entrega, fecha_envio, fecha_inicio_estado, id_estado, id_etapa, id_orden, nro_ficha, id];

      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };

  static updateEtapaLabo(etapaData) {
    return new Promise((resolve, reject) => {
      const { id, descripcion, id_estado, id_orden, nro_ficha } = etapaData;
      const query = 'UPDATE historial_ordenes_etapas_estados SET descripcion = ?, id_estado = ?, id_orden = ?, nro_ficha = ? WHERE id = ?';
      const values = [descripcion, id_estado, id_orden, nro_ficha, id];

      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };

  static deleteEtapa(id) {
    return new Promise((resolve, reject) => {
      const date = new Date();
      const sqlDelete = [date, id]
      const deleteSql = 'UPDATE historial_ordenes_etapas_estados SET activo = 0, ulti_fecha_cambio_act = ?  WHERE id = ?';

      db.query(deleteSql, sqlDelete, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Etapas;
