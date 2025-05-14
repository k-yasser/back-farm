const express = require('express');

const {
  signUpValidator,
  loginValidator
} =require('../utils/validators/authValidators')

const {
  signUp,
  login
} = require('../services/authService');

const router = express.Router();


router.route('/signup').post(signUpValidator,signUp);
router.route('/login').post(loginValidator,login);

/*router
  .route('/:id')
  .get( getUserValidator,getUser)
  .put(updateUserValidator ,updateUser)
  .delete( deleteUserValidator,deleteUser);*/

module.exports = router;