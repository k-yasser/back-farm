const express = require('express');
const {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalsByOwner,
  getAnimalByRFID,
  verifyAnimal,
  getPendingAnimals,
  getNonAvailableAnimals
} = require("../services/animalService");

const {
  getAnimalValidator,
  createAnimalorValidator,
  updateAnimalValidator,
  deleteAnimaleValidator
} = require('../utils/validators/animalValidators');

const AuthService = require('../services/authService.js');
const asyncHandler = require('express-async-handler');
const AnimalModel = require("../model/animalModel");

const router = express.Router();

// 👇 Custom route to get all animals owned by the logged-in user
router.get('/mine', AuthService.protect, asyncHandler(async (req, res) => {
  const animals = await AnimalModel.find({ owner: req.user._id })
    .populate({ path: 'type', select: 'name -_id' });

  res.status(200).json({
    result: animals.length,
    data: animals
  });
}));

// 👇 Place these BEFORE `/:id` to avoid route conflicts
router.get('/owner/:id', getAnimalsByOwner);
router.get('/rfid/:rfid', getAnimalByRFID);
router.put('/verify/:id', AuthService.protect, AuthService.allowedTo('user'), verifyAnimal);
router.get('/status/pending/:ownerId', getPendingAnimals);
router.get('/status/non-available/:ownerId', getNonAvailableAnimals);

// 👇 Main CRUD routes
router
  .route('/')
  .get(getAnimals)
  .post(AuthService.protect, AuthService.allowedTo('user'), createAnimalorValidator, createAnimal);

router
  .route('/:id')
  .get(getAnimalValidator, getAnimal)
  .put(AuthService.protect, AuthService.allowedTo('user'), updateAnimalValidator, updateAnimal)
  .delete(AuthService.protect, AuthService.allowedTo('user'), deleteAnimaleValidator, deleteAnimal);

module.exports = router;
