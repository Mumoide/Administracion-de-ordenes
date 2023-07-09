const { check, validationResult } = require("express-validator");

const nameRegex = /^[A-Za-zÀ-ÿ]*(?:\s[A-Za-zÀ-ÿ]*){0,2}$/;
const validateEditOrdenes = () => {
    return [
        check('patientName', 'Nombre de paciente es inválido')
            .trim()
            .notEmpty()
            .isLength({ min: 2, max: 25 })
            .withMessage('El nombre de paciente debe tener entre 3 y 25 caracteres')
            .custom((value) => nameRegex.test(value))
            .withMessage('El nombre de paciente no puede contener caracteres numéricos')
            .escape(),

        check('patientLastName', 'Apellido de paciente es inválido')
            .trim()
            .notEmpty()
            .isLength({ min: 2, max: 25 })
            .withMessage('El apellido de paciente debe tener entre 3 y 25 caracteres')
            .custom((value) => nameRegex.test(value))
            .withMessage('El apellido de paciente no puede contener caracteres numéricos')
            .escape(),
        check('patientRut', 'Rut de paciente es inválido, debe tener el siguiente formato: [ 11111111-1')
            .notEmpty()
            .withMessage('El Rut de paciente debe tener el siguiente formato: [ 11111111-1 ]')
            .isLength({ min: 7, max: 10 })
            .escape(),
        check('doctorName', 'Nombre de doctor es inválido')
            .trim()
            .notEmpty()
            .isLength({ min: 2, max: 25 })
            .withMessage('El nombre de doctor debe tener entre 3 y 25 caracteres')
            .custom((value) => nameRegex.test(value))
            .withMessage('El nombre de doctor no puede contener caracteres numéricos')
            .escape(),

        check('doctorLastName', 'Apellido de doctor es inválido')
            .trim()
            .notEmpty()
            .isLength({ min: 2, max: 25 })
            .withMessage('El apellido de doctor debe tener entre 3 y 25 caracteres')
            .custom((value) => nameRegex.test(value))
            .withMessage('El apellido de doctor no puede contener caracteres numéricos')
            .escape(),
        check('doctorRut', 'Rut de doctor es inválido, debe tener el siguiente formato: [ 11111111-1')
            .notEmpty()
            .withMessage('El Rut de doctor debe tener el siguiente formato: [ 11111111-1 ]')
            .isLength({ min: 7, max: 10 })
            .escape(),
        check('patientBirthDate', 'Fecha de nacimiento es inválida')
            .optional({ checkFalsy: true })
            .isDate()
            .withMessage('La fecha de nacimiento debe tener el siguiente formato: YYYY-MM-DD'),

        check('creationDate', 'Fecha de creación es inválida')
            .notEmpty()
            .isDate()
            .withMessage('La fecha de creación debe tener el siguiente formato: YYYY-MM-DD'),

        check('fileNumber', 'Número de ficha es inválido')
            .notEmpty()
            .isInt()
            .withMessage('La orden debe ser un número entero')
            .withMessage('El número de ficha debe ser un número entero').
            isLength({ max: 8 })
            .withMessage('La orden debe tener largo maximo de 8'),

        check('medicalCenter', 'Centro es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El centro debe ser un número entero'),

        check('workType', 'Tipo de trabajo es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El tipo de trabajo debe ser un número entero'),

        check('prothesis', 'Prótesis es inválida')
            .notEmpty()
            .isInt()
            .withMessage('La prótesis debe ser un número entero'),

        check('completitude', 'Completitud es inválida')
            .notEmpty()
            .isInt()
            .withMessage('La completitud debe ser un número entero'),

        check('color', 'Color es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El color debe ser un número entero'),

        check('location', 'Ubicación es inválida')
            .notEmpty()
            .isInt()
            .withMessage('La ubicación debe ser un número entero'),

        check('indications', 'Indicaciones son inválidas')
            .optional({ checkFalsy: true })
            .isLength({ max: 255 })
            .withMessage('Las indicaciones deben tener maximo 255 caracteres')
            .escape(),

        check('billing', 'Tipo de factura es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El tipo de factura debe ser un número entero'),

        check('billingDate', 'Fecha de facturación es inválida')
            .notEmpty()
            .isDate()
            .withMessage('La fecha de facturación debe tener el siguiente formato: YYYY-MM-DD'),

        check('licence', 'Licencia es inválida')
            .notEmpty()
            .isInt()
            .withMessage('La licencia debe ser un número entero'),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formattedErrors = errors.array().map((error) => {
                    return error.msg;
                });
                return res.status(400).json({ errors: formattedErrors });
            }
            next();
        }
    ];
};

module.exports = validateEditOrdenes;
