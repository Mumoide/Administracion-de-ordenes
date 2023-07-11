const { check, validationResult } = require("express-validator");

const nameRegex = /^[A-Za-zÀ-ÿ]*(?:\s[A-Za-zÀ-ÿ]*){0,2}$/;
const validarPersonaNopass = () => {
    return [
        check('email', 'Email es inválido')
            .isEmail()
            .normalizeEmail()
            .notEmpty()
            .isLength({ min: 5, max: 100 })
            .trim()
            .escape(),
        check('name', 'Nombre es inválido')
            .trim()
            .notEmpty()
            .isLength({ min: 2, max: 25 })
            .withMessage('El nombre debe tener entre 3 y 25 caracteres')
            .custom((value) => nameRegex.test(value))
            .withMessage('El nombre no puede contener caracteres numéricos')
            .escape(),
        check('lastName', 'Apellido es inválido')
            .trim()
            .notEmpty()
            .isLength({ min: 2, max: 25 })
            .withMessage('El apellido debe tener entre 3 y 25 caracteres')
            .custom((value) => nameRegex.test(value))
            .withMessage('El apellido no puede contener caracteres numéricos')
            .escape(),
        check('address', 'Dirección es inválida')
            .optional({ checkFalsy: true })
            .isLength({ max: 100 })
            .withMessage('La dirección debe tener entre 5 y 100 caracteres')
            .trim()
            .escape(),
        check('phone', 'Celular es inválido')
            .matches(/^(?:\+?56|0)(?:[2-9])(?:\d{7,})$/)
            .withMessage('El número de celular debe tener el siguiente formato [+56912345678 o 56912345678]')
            .optional({ checkFalsy: true })
            .isLength({ max: 12 }),
        check('role', 'Rol es inválido')
            .notEmpty()
            .isInt()
            .withMessage('El rol debe ser un número entero'),
        check('birthDate', 'Fecha de nacimiento es inválida')
            .optional({ checkFalsy: true })
            .isDate()
            .withMessage('La fecha de nacimiento debe tener el siguiente formato: YYYY-MM-DD'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formattedErrors = errors.array().map((error) => {
                    if (error.msg === 'Invalid value') {
                        if (error.param === 'nombre' || error.param === 'apellido') {
                            return `El ${error.param} debe tener entre 2 y 25 caracteres y no puede contener caracteres numéricos`;
                        }
                        if (error.param === 'direccion') {
                            return 'La dirección debe tener entre máximo 100 caracteres';
                        }
                        if (error.param === 'rol_id') {
                            return 'El rol debe ser un número entero';
                        }
                    }
                    return error.msg;
                });
                return res.status(400).json({ errors: formattedErrors });
            }
            next();
        }
    ];
};

module.exports = validarPersonaNopass;
