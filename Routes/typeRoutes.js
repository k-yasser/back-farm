const express = require('express');
const {
    getTypes,
    getType,
    createType,
    updateType,deleteType
} = require("../services/typeService")

const router =express.Router();

const AuthService= require('../services/authService.js')

//router.get('/' ,getCategories )

router.route('/')
    .get(getTypes)
    .post(AuthService.protect ,AuthService.allowedTo('admin'),createType);

router.route('/:id')
    .get(getType)  
    .put(AuthService.protect ,AuthService.allowedTo('admin'),updateType)
    .delete(AuthService.protect ,AuthService.allowedTo('admin'),deleteType)

module.exports = router