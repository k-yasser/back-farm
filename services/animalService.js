const asyncHandler = require('express-async-handler');
const slugify = require('slugify')
const AnimalModel =require("../model/animalModel")
const TypeModel = require("../model/typeModel");
const UserModel = require("../model/userModel");

    exports.getAnimals =asyncHandler(async(req,res) => {
        const page = req.query.page *1 || 1;
        const limit= req.query.limit *1 || 10;
        const skip =(page-1)*limit
        const animals =await AnimalModel.find({}).skip(skip).limit(limit).populate({path:'type',select:'name -_id'})
        res.status(200).json({resultat : animals.length, page ,data:animals})
    })

    exports.getAnimal = asyncHandler(async(req,res) => {
        const {id} =req.params;
        const animal = await AnimalModel.findById(id).populate({path:'type',select:'name -_id'})
        if(!animal){
            res.status(404).json({msg:`no animal for this id ${id}`})
        }
        res.status(200).json({data:animal})


    })

exports.createAnimal = asyncHandler(async (req, res) => {
    const { type, owner, name } = req.body;

    // Check if type exists
    const typeExists = await TypeModel.findById(type);
    if (!typeExists) {
        return res.status(400).json({ msg: `Invalid type ID: ${type}` });
    }

    // Check if owner exists
    const ownerExists = await UserModel.findById(owner);
    if (!ownerExists) {
        return res.status(400).json({ msg: `Invalid owner ID: ${owner}` });
    }

    req.body.slug=slugify(req.body.type)
    const animal = await AnimalModel.create(req.body);
    res.status(201).json({ data: animal });
});

    exports.updateAnimal =asyncHandler(async(req,res)=> {
        const {id} =req.params;

        if(req.body.name){
            req.body.slug=slugify(req.body.name)
    }

        const animal = await AnimalModel.findOneAndUpdate({_id :id},req.body ,{new : true})
        if(!animal){
            res.status(404).json({msg:`no animal for this id ${id}`})
        }
        res.status(200).json({data:animal})
    })

    exports.deleteAnimal =asyncHandler(async(req,res) => {
        const {id}=req.params;
        const animal= await AnimalModel.findOneAndDelete({_id:id})
        if(!animal){
            res.status(404).json({msg:`no animal for this id ${id}`})
        }
        res.status(200).send()

    })

    exports.getAnimalsByOwner = asyncHandler(async (req, res) => {
    const { ownerId } = req.params;
    const animals = await AnimalModel.find({ owner: ownerId })
        .populate({ path: 'type', select: 'name -_id' });

    res.status(200).json({
        result: animals.length,
        data: animals
    });
});


exports.getAnimalByRFID = asyncHandler(async (req, res) => {
    const { rfid } = req.params;
    const animal = await AnimalModel.findOne({ rfid }).populate({ path: 'type', select: 'name -_id' });

    if (!animal) {
        return res.status(404).json({ msg: `No animal found with RFID: ${rfid}` });
    }

    res.status(200).json({ data: animal });
});


exports.verifyAnimal = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const animal = await AnimalModel.findById(id);

    if (!animal) {
        return res.status(404).json({ msg: `No animal found with ID: ${id}` });
    }

    if (animal.status !== 'pending') {
        return res.status(400).json({ msg: `Animal status is not pending. Current status: ${animal.status}` });
    }

    animal.status = 'verified';
    await animal.save();

    res.status(200).json({ msg: 'Animal verified successfully', data: animal });
});


exports.getPendingAnimals = asyncHandler(async (req, res) => {
    const { ownerId } = req.params;

    const animals = await AnimalModel.find({ owner: ownerId, status: 'pending' })
        .populate({ path: 'type', select: 'name -_id' });

    res.status(200).json({ result: animals.length, data: animals });
});

exports.getNonAvailableAnimals = asyncHandler(async (req, res) => {
    const { ownerId } = req.params;

    const animals = await AnimalModel.find({ owner: ownerId, status: 'non-available' })
        .populate({ path: 'type', select: 'name -_id' });

    res.status(200).json({ result: animals.length, data: animals });
});