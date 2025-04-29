const express = require('express');
const {
    getTypes,
    getType,
    createType,
    updateType,deleteType
} = require("../services/typeService")

const router =express.Router();

//router.get('/' ,getCategories )

router.route('/')
    .get(getTypes)
    .post(createType);

router.route('/:id')
    .get(getType)  
    .put(updateType)
    .delete(deleteType)

module.exports = router