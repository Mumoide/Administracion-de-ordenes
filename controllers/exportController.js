const OrdenesModel = require('../models/ordenesModel');
const EtapasModel = require('../models/etapaModel');
const UserModel = require('../models/userModel');
const UserRelatedModel = require('../models/userRelatedModel');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

class ExportController {
    static exportOrders(req, res) {
        OrdenesModel.get((error, results) => {
            if (error) {
                console.error('Error retrieving data:', error);
                return res.status(500).json({
                    estado: 'Error',
                    message: error,
                });
            }

            const dataArray = results.map((obj) => [
                obj.id,
                obj.numero_ficha,
                obj.fecha_creacion ? obj.fecha_creacion.toISOString().split('T')[0] : '',
                obj.fecha_inicio_estado ? obj.fecha_inicio_estado.toISOString().split('T')[0] : '',
                obj.fecha_entrega ? obj.fecha_entrega.toISOString().split('T')[0] : '',
                obj.fecha_envio ? obj.fecha_envio.toISOString().split('T')[0] : '',
                obj.nombre_tipo,
                obj.fecha_facturacion ? obj.fecha_facturacion.toISOString().split('T')[0] : '',
                obj.nombre_ubicaciones,
                obj.rut_doctor,
                obj.nombre_trabajo,
                obj.nombre_centro,
                obj.nombre_etapas,
                obj.id_etapa,
                obj.nombre_protesis,
                obj.nombre_completitud,
                obj.activo,
                obj.etapa_activa,
            ]);

            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Ordenes de trabajo');

                // Add headers
                const headers = [
                    'ID',
                    'Numero Ficha',
                    'Fecha Creacion',
                    'Fecha Inicio Estado',
                    'Fecha Entrega',
                    'Fecha Envio',
                    'Nombre Tipo',
                    'Fecha Facturacion',
                    'Nombre Ubicaciones',
                    'Rut Doctor',
                    'Nombre Trabajo',
                    'Nombre Centro',
                    'Nombre Etapas',
                    'ID Etapa',
                    'Nombre Protesis',
                    'Nombre Completitud',
                    'Activo',
                    'Etapa Activa',
                ];
                worksheet.addRow(headers);

                // Add data rows
                dataArray.forEach(row => {
                    worksheet.addRow(row);
                });

                // Save the workbook to a buffer
                workbook.xlsx.writeBuffer()
                    .then(buffer => {
                        const filePath = path.join(__dirname, '..', 'public', 'exported_data.xlsx');

                        // Write the buffer to the file
                        fs.writeFileSync(filePath, buffer, 'binary');

                        // Send the file as a response
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', 'attachment; filename=exported_data.xlsx');
                        res.download(filePath, 'exported_data.xlsx', (error) => {
                            if (error) {
                                console.error('Error sending file:', error);
                                res.status(500).json({
                                    estado: 'Error',
                                    message: 'Error sending file',
                                });
                            }
                            // Delete the temporary file after sending
                            fs.unlinkSync(filePath);
                        });
                    })
                    .catch(error => {
                        console.error('Error exporting data:', error);
                        res.status(500).json({
                            estado: 'Error',
                            message: 'Error exporting data',
                        });
                    });
            } catch (error) {
                console.error('Error exporting data:', error);
                res.status(500).json({
                    estado: 'Error',
                    message: 'Error exporting data',
                });
            }
        });
    }

    static exportStages(req, res) {
        const id = req.params.id;
        EtapasModel.getAllEtapasForExport(id).then((results) => {
            const dataArray = results.map((obj) => [
                obj.id,
                obj.id_orden,
                obj.nro_ficha,
                obj.id_etapa,
                obj.id_estado,
                obj.fecha_envio ? obj.fecha_envio.toISOString().split('T')[0] : '',
                obj.fecha_entrega ? obj.fecha_entrega.toISOString().split('T')[0] : '',
                obj.fecha_inicio_estado ? obj.fecha_inicio_estado.toISOString().split('T')[0] : '',
                obj.descripcion,
                obj.activo,
                obj.ulti_fecha_cambio_act,
                obj.nombre_estados,
                obj.nombre_etapas,
            ]);

            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Ordenes de trabajo');

                // Add headers
                const headers = [
                    'ID',
                    'Id de la orden',
                    'Numero de ficha',
                    'Id de la etapa',
                    'Fecha de envio',
                    'Fecha de entrega',
                    'Fecha de inicio de estado',
                    'Descripcion',
                    'Activo',
                    'Ultima fecha de cambio de activo',
                    'Nombre del estado',
                    'Nombre de la etapa',
                ];
                worksheet.addRow(headers);

                // Add data rows
                dataArray.forEach(row => {
                    worksheet.addRow(row);
                });

                // Save the workbook to a buffer
                workbook.xlsx.writeBuffer()
                    .then(buffer => {
                        const filePath = path.join(__dirname, '..', 'public', 'exported_data.xlsx');

                        // Write the buffer to the file
                        fs.writeFileSync(filePath, buffer, 'binary');

                        // Send the file as a response
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', 'attachment; filename=exported_data.xlsx');
                        res.download(filePath, 'exported_data.xlsx', (error) => {
                            if (error) {
                                console.error('Error sending file:', error);
                                res.status(500).json({
                                    estado: 'Error',
                                    message: 'Error sending file',
                                });
                            }
                            // Delete the temporary file after sending
                            fs.unlinkSync(filePath);

                        });
                    })
                    .catch(error => {
                        console.error('Error exporting data:', error);
                        res.status(500).json({
                            estado: 'Error',
                            message: 'Error exporting data',
                        });
                    });
            } catch (error) {
                console.error('Error exporting data:', error);
                res.status(500).json({
                    estado: 'Error',
                    message: 'Error exporting data',
                });
            };
        }).catch((error) => {
            console.error('Error retrieving data:', error);
            return res.status(500).json({
                estado: 'Error',
                message: error,
            });
        });
    }

    static exportUsers(req, res) {
        UserModel.getAllForExport((error, results) => {
            if (error) {
                return res.status(500).json({
                    estado: 'Error',
                    message: error,
                });
            }

            const dataArray = results.map((obj) => [
                obj.id,
                obj.rut,
                obj.nombre,
                obj.apellido,
                obj.fecha_nacimiento ? obj.fecha_nacimiento.toISOString().split('T')[0] : '',
                obj.direccion,
                obj.celular,
                obj.email,
                obj.nombre_rol,
            ]);

            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Ordenes de trabajo');

                // Add headers
                const headers = [
                    'Id',
                    'Rut',
                    'Nombre',
                    'Apellido',
                    'Fecha Nacimiento',
                    'Direccion',
                    'Celular',
                    'Email',
                    'Nombre Rol',
                ];
                worksheet.addRow(headers);

                // Add data rows
                dataArray.forEach(row => {
                    worksheet.addRow(row);
                });

                // Save the workbook to a buffer
                workbook.xlsx.writeBuffer()
                    .then(buffer => {
                        const filePath = path.join(__dirname, '..', 'public', 'exported_data.xlsx');

                        // Write the buffer to the file
                        fs.writeFileSync(filePath, buffer, 'binary');

                        // Send the file as a response
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', 'attachment; filename=exported_data.xlsx');
                        res.download(filePath, 'exported_data.xlsx', (error) => {
                            if (error) {
                                console.error('Error sending file:', error);
                                res.status(500).json({
                                    estado: 'Error',
                                    message: 'Error sending file',
                                });
                            }
                            // Delete the temporary file after sending
                            fs.unlinkSync(filePath);
                        });
                    })
                    .catch(error => {
                        console.error('Error exporting data:', error);
                        res.status(500).json({
                            estado: 'Error',
                            message: 'Error exporting data',
                        });
                    });
            } catch (error) {
                console.error('Error exporting data:', error);
                res.status(500).json({
                    estado: 'Error',
                    message: 'Error exporting data',
                });
            }
        });
    }

    static exportRelatedUsers(req, res) {
        UserRelatedModel.getAllForExport((error, results) => {
            if (error) {
                return res.status(500).json({
                    estado: 'Error',
                    message: error,
                });
            }

            const dataArray = results.map((obj) => [
                obj.id,
                obj.rut,
                obj.nombre,
                obj.apellido,
                obj.fecha_nacimiento ? obj.fecha_nacimiento.toISOString().split('T')[0] : '',
                obj.direccion,
                obj.celular,
                obj.email,
                obj.nombre_rol,
            ]);

            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Ordenes de trabajo');

                // Add headers
                const headers = [
                    'Id',
                    'Rut',
                    'Nombre',
                    'Apellido',
                    'Fecha Nacimiento',
                    'Direccion',
                    'Celular',
                    'Email',
                    'Nombre Rol',
                ];
                worksheet.addRow(headers);

                // Add data rows
                dataArray.forEach(row => {
                    worksheet.addRow(row);
                });

                // Save the workbook to a buffer
                workbook.xlsx.writeBuffer()
                    .then(buffer => {
                        const filePath = path.join(__dirname, '..', 'public', 'exported_data.xlsx');

                        // Write the buffer to the file
                        fs.writeFileSync(filePath, buffer, 'binary');

                        // Send the file as a response
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        res.setHeader('Content-Disposition', 'attachment; filename=exported_data.xlsx');
                        res.download(filePath, 'exported_data.xlsx', (error) => {
                            if (error) {
                                console.error('Error sending file:', error);
                                res.status(500).json({
                                    estado: 'Error',
                                    message: 'Error sending file',
                                });
                            }
                            // Delete the temporary file after sending
                            fs.unlinkSync(filePath);
                        });
                    })
                    .catch(error => {
                        console.error('Error exporting data:', error);
                        res.status(500).json({
                            estado: 'Error',
                            message: 'Error exporting data',
                        });
                    });
            } catch (error) {
                console.error('Error exporting data:', error);
                res.status(500).json({
                    estado: 'Error',
                    message: 'Error exporting data',
                });
            }
        });
    }
}

module.exports = ExportController;