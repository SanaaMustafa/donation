const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const mime = require('mime');
const multer = require('multer');

const RequestController = require('../controllers/request');
const checkAuth = require('../middelware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
      });//
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });


router.post("/",checkAuth,upload.array('img'), RequestController.createRequest);
router.get('/',RequestController.getAll);
router.get('/:reqId', RequestController.getOne);
router.put('/:reqId/accept',checkAuth,RequestController.updateAccepted);
router.put('/:reqId/cancle',checkAuth,RequestController.updateRejected);
router.put('/:reqId/donate',checkAuth,RequestController.updateDonate);
router.get('/history/donation',checkAuth,RequestController.getAllIDonate);
router.get('/history/requests',checkAuth,RequestController.getAllIRequest);
router.get('/admin/all/requests',checkAuth,RequestController.getAllforAdmin);





module.exports = router;