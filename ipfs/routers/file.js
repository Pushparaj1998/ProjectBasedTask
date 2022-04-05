const express = require('express');
const router = express.Router();
const multer = require('multer');

const FileController = require('../controllers/file');
const fileController = new FileController();

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/nft/')
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

const fileUpload = upload.fields([{ name: 'file', maxCount: 1 }]);

router.post('/file/upload', fileUpload, fileController.upload);


module.exports = router;