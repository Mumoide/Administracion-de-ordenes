const db = require('../database/db');

const dashboardModel = {};

dashboardModel.getAdminCount = (callback) => {
    const adminCountQuery = 'SELECT COUNT(id) AS admins FROM personas WHERE rol_id = 1 and activo = 1';
    db.query(adminCountQuery, (error, result) => {
        if (error) {
            console.error('Error executing adminCountQuery:', error);
            callback(error, null);
        } else {
            const adminCount = result[0].admins;
            callback(null, adminCount);
        }
    });
};

dashboardModel.getLaboratoristCount = (callback) => {
    const labCountQuery = 'SELECT COUNT(id) AS labos FROM personas WHERE rol_id = 2 and activo = 1';
    db.query(labCountQuery, (error, result) => {
        if (error) {
            console.error('Error executing labCountQuery:', error);
            callback(error, null);
        } else {
            const laboratoristCount = result[0].labos;
            callback(null, laboratoristCount);
        }
    });
};

dashboardModel.getOrdersCount = (callback) => {
    const orderCountQuery = 'SELECT COUNT(id) AS orders FROM ordenes_de_trabajo';
    db.query(orderCountQuery, (error, result) => {
        if (error) {
            console.error('Error executing orderCountQuery:', error);
            callback(error, null);
        } else {
            const ordersCount = result[0].orders;
            callback(null, ordersCount);
        }
    });
};

dashboardModel.getEtapasCount = (callback) => {
    const etapasCountQuery = 'SELECT nombre_etapas, COUNT(id_orden) AS totales FROM historial_ordenes_etapas_estados a JOIN etapas b ON a.id_etapa = b.id WHERE a.activo = 1 GROUP BY nombre_etapas';
    db.query(etapasCountQuery, (error, result) => {
        if (error) {
            console.error('Error executing etapasCountQuery:', error);
            callback(error, null);
        } else {
            const etapasCount = result;
            callback(null, etapasCount);
        }
    });
};

dashboardModel.getEtapasTypeCount = (callback) => {
    const etapasCountQuery = 'SELECT COUNT(id) AS totales FROM etapas';
    db.query(etapasCountQuery, (error, result) => {
        if (error) {
            console.error('Error executing etapasCountQuery:', error);
            callback(error, null);
        } else {
            const etapasTypeCount = result;
            callback(null, etapasTypeCount[0].totales);
        }
    });
};

dashboardModel.getEstadosCount = (callback) => {
    const estadosCountQuery = 'SELECT nombre_estados, COUNT(id_orden) AS totales FROM historial_ordenes_etapas_estados a JOIN estados b ON a.id_estado = b.id WHERE a.activo = 1 GROUP BY nombre_estados;';
    db.query(estadosCountQuery, (error, result) => {
        if (error) {
            console.error('Error executing estadosCountQuery:', error);
            callback(error, null);
        } else {
            const estadosCount = result;
            callback(null, estadosCount);
        }
    });
};

dashboardModel.getEstadosTypeCount = (callback) => {
    const estadosCountQuery = 'SELECT COUNT(id) AS totales FROM estados';
    db.query(estadosCountQuery, (error, result) => {
        if (error) {
            console.error('Error executing etapasCountQuery:', error);
            callback(error, null);
        } else {
            const estadosTypeCount = result;
            callback(null, estadosTypeCount[0].totales);
        }
    });
};
module.exports = dashboardModel;
