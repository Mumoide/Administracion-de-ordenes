const OrdenesModel = require('../models/ordenesModel');
const validarRut = require('../helpers/validarRut');

class OrdenesController {


    static getAll(req, res) {
        OrdenesModel.get((error, results) => {
            if (error) {
                res.status(500).json({
                    estado: 'Error',
                    message: error
                });
            } else {

                res.json({ Status: "Success", Results: results });
            }
        });

    }

    static getById(req, res) {
        const { id } = req.params;

        OrdenesModel.getById(id)
            .then((orden) => {
                if (!orden) {
                    res.status(404).json({ error: 'Orden de trabajo no encontrada' });
                    return;
                }

                res.json(orden);
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({ error: 'Error al obtener la orden de trabajo' });
            });
    }

    static create(req, res) {
        const { creationDate,
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
            licence } = req.body;
        console.log(req.body)

        if (validarRut(patientRut)) {
            OrdenesModel.create(
                {
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
                    licence
                },
                (error, ordenId) => {
                    if (error) {
                        res.status(400).json({
                            estado: 'Error',
                            message: error,
                        });
                    } else {
                        res.json({
                            message: 'Orden de trabajo creada exitosamente',
                        });
                    }
                }
            );
        } else {
            res.status(400).json({
                estado: 'Rut inválido',
                message: 'El Rut debe tener el siguiente formato: [ 11111111-1 ]',
            });
        }


    }

    static deleteOrden(req, res) {
        const { id } = req.params;

        OrdenesModel.deleteOrden(id)
            .then((deletedRows) => {
                if (deletedRows === null) {
                    res.status(404).json({ error: 'Orden de trabajo no encontrada' });
                    return;
                }

                res.json({ Status: "Success", message: 'Orden de trabajo eliminada exitosamente', id: id });
            })
            .catch((error) => {
                console.error('Error:', error);
                res.status(500).json({ error: 'Error al eliminar la orden de trabajo' });
            });
    }


    static update(req, res) {
        const orderId = req.params.id;
        const data = req.body;
        const { patientRut } = req.body;
        if (validarRut(patientRut)) {
            OrdenesModel.update(orderId, data, (error, orderId) => {
                if (error) {
                    res.status(400).json({
                        estado: 'Error',
                        message: error.message
                    });
                } else {
                    res.json({
                        Status: "Success",
                        message: 'Orden de trabajo actualizada exitosamente',
                    });
                }
            });
        } else {
            res.status(400).json({
                estado: 'Rut inválido',
                message: 'El Rut debe tener el siguiente formato: [ 11111111-1 ]',
            });
        }



    }

    static assignUser(req, res) {
        const { fileNumber, rut } = req.params;
        OrdenesModel.assignUser(fileNumber, rut, (error, results) => {
            if (error) {
                res.status(500).json({
                    estado: 'Error',
                    message: error
                });
            } else {

                res.json({ Status: "Success", Results: results });
            }
        });

    }

}

module.exports = OrdenesController;
