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

router.put('/changePassword/:id',changePasswordValidator,changeUserPassword)

router
  .route('/')
  .get(getUsers)
  .post(createUserValidator,createUser);
router
  .route('/:id')
  .get( getUserValidator,getUser)
  .put(updateUserValidator ,updateUser)
  .delete( deleteUserValidator,deleteUser);

module.exports = router;