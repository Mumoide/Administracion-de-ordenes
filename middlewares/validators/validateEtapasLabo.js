const { check, validationResult } = require("express-validator");

const validateEtapas = () => {
    return [
        check('nro_ficha')
            .isInt().withMessage('El número de ficha es inválido')
            .isLength({ max: 8 }).withMessage('El largo no puede superar 8 caracteres')
            .notEmpty().withMessage('El número de ficha no puede quedar vacío')
            .escape(),
        check('id_orden')
            .isInt().withMessage('El id de orden es inválido')
            .notEmpty().withMessage('El id de orden no puede quedar vacío')
            .escape(),
        check('id_estado')
            .isInt().withMessage('El id de estado es inválido')
            .notEmpty().withMessage('El id de estado no puede quedar vacío')
            .escape(),
        check('descripcion')
            .optional({ checkFalsy: true })
            .isLength({ max: 255 })
            .withMessage('La descripción no puede superar los 255 caracteres')
            .trim(),
        (req, res, next) => {
            console.log('Validating etapa')
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formattedErrors = errors.array().map((error) => {
                    return {
                        field: error.param,
                        message: error.msg
                    };
                });
                return res.status(400).json({ errors: formattedErrors });
            }
            next();
        }
    ];
};

module.exports = validateEtapas;
