const express = require('express');
const {
    getAnimals,
    getAnimal,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimalsByOwner,
    getAnimalByRFID 
} = require("../services/animalService")


const {
    getAnimalValidator,
    createAnimalorValidator,
    updateAnimalValidator,
    deleteAnimaleValidator
} =require('../utils/validators/animalValidators')

const router =express.Router();

const AuthService= require('../services/authService.js')


//router.get('/' ,getCategories )

router
    .route('/')
    .get(getAnimals)
    .post(AuthService.protect ,AuthService.allowedTo('user'),createAnimalorValidator,createAnimal);

router
    .route('/:id')
    .get(getAnimalValidator,getAnimal)  
    .put(AuthService.protect ,AuthService.allowedTo('user'),updateAnimalValidator,updateAnimal)
    .delete(AuthService.protect ,AuthService.allowedTo('user'),deleteAnimaleValidator,deleteAnimal)

router.route("/owner/:id").get(getAnimalsByOwner)
router.get('/rfid/:rfid', getAnimalByRFID);


module.exports = router