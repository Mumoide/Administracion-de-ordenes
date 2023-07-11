const { check, validationResult } = require("express-validator");

const validarPassword = () => {
  return [
    check('password', 'Password es inválido')
      .trim()
      .notEmpty()
      .withMessage('La contraseña no puede estar vacía.')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres.')
      // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      // .withMessage('La contraseña debe tener al menos una mayúscula, una minúscula y un número.')
      .escape(),
    check('email', 'Email es inválido')
      .isEmail()
      .withMessage('Formato de email invalido')
      .normalizeEmail()
      .notEmpty()
      .withMessage('El email no puede estar vacío.')
      .isLength({ min: 5, max: 100 })
      .withMessage('El email debe tener entre 5 y 100 caracteres.')
      .trim()
      .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => {
          return error.msg;
        });
        return res.status(400).json({ message: formattedErrors });
      }
      next();
    }
  ];
};

module.exports = validarPassword;
