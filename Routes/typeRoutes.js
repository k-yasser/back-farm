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
    .post(AuthService.protect ,createType);

router.route('/:id')
    .get(getType)  
    .put(updateType)
    .delete(deleteType)

module.exports = router