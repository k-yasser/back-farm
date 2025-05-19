const express = require('express');

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
} =require('../utils/validators/userValidators')

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} = require('../services/userService');

const router = express.Router();

const AuthService= require('../services/authService.js')


router.put('/changePassword/:id',changePasswordValidator,changeUserPassword)

router
  .route('/')
  .get(getUsers)
  .post(AuthService.protect ,AuthService.allowedTo('admin'),createUserValidator,createUser);
router
  .route('/:id')
  .get(AuthService.protect ,AuthService.allowedTo('admin'), getUserValidator,getUser)
  .put(AuthService.protect ,AuthService.allowedTo('admin'),updateUserValidator ,updateUser)
  .delete( AuthService.protect ,AuthService.allowedTo('admin'),deleteUserValidator,deleteUser);

module.exports = router;