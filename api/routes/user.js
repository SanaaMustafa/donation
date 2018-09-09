const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middelware/check-auth');



router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.get('/profile',checkAuth, UserController.getOne);
router.get('/admin/all-users',checkAuth,UserController.getAll);
router.get('/admin/one-user/:userId',checkAuth,UserController.getOneByAdmin);
router.get('/admin/number-of-users',checkAuth,UserController.getCountOfAllUsers);



module.exports = router;