const express = require('express');
const {
    getAnimals,
    getAnimal,
    createAnimal,
    updateAnimal,deleteAnimal
} = require("../services/animalService")


const {
    getAnimalValidator,
    createAnimalorValidator,
    updateAnimalValidator,
    deleteAnimaleValidator
} =require('../utils/validators/animalValidators')

const router =express.Router();

//router.get('/' ,getCategories )

router
    .route('/')
    .get(getAnimals)
    .post(createAnimalorValidator,createAnimal);

router
    .route('/:id')
    .get(getAnimalValidator,getAnimal)  
    .put(updateAnimalValidator,updateAnimal)
    .delete(deleteAnimaleValidator,deleteAnimal)

module.exports = router