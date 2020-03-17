const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/userController');

router.post('/signup',UserController.users_user_signup);
router.post('/login', UserController.users_user_login);
router.delete('/:userId',checkAuth , UserController.users_delete_user);


module.exports = router;