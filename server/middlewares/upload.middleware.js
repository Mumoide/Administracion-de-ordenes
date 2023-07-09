const multer = require('multer');
const path = require('path')

// Configuración de Multer para guardar las imágenes en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
})

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
    return;
  }
};

// Middleware de carga de imagen utilizando Multer
const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter
})

module.exports = uploadMiddleware;
