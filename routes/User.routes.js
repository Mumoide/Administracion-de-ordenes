const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyRoute = require("../middlewares/verificadorToken")
const uploadMiddleware = require("../middlewares/upload.middleware")
const validarPersona = require('../middlewares/validators/validatorPersona');
const multer = require('multer');
const validarPersonaNoPass = require('../middlewares/validators/validatorPersonaNoPass');

router.get('/persona', verifyRoute([1]), userController.getAll);
router.get('/persona/:id', verifyRoute([1]), userController.getById);
router.post('/persona', uploadMiddleware.single('imagen'), validarPersona(), verifyRoute([1]), userController.create);
router.put('/persona/:id', uploadMiddleware.single('image'), validarPersona(), verifyRoute([1]), userController.update);
router.put('/personaNoPass/:id', uploadMiddleware.single('image'), validarPersonaNoPass(), verifyRoute([1]), userController.updateNoPass);
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer error occurred (e.g., file size exceeds limit)
        res.status(400).json({ error: 'Multer Error: ' + err.message });
        return;
    } else if (err) {
        // Other error occurred (e.g., file type not allowed)
        res.status(400).json({ error: err.message });
        return;
    } else {
        next(); // If no error, pass control to the next middleware
    }
});
router.delete('/persona/:id', verifyRoute([1]), userController.delete);

module.exports = router;
