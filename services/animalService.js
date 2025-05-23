const asyncHandler = require('express-async-handler');
const slugify = require('slugify')
const AnimalModel =require("../model/animalModel")

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

    exports.createAnimal = asyncHandler (async (req,res) => {
        req.body.slug=slugify(req.body.type)
        //async await
        const animal = await AnimalModel.create( req.body)
        res.status(201).json({data:animal});
    })

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

