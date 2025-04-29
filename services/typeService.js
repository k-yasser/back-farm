const asyncHandler = require('express-async-handler');
const slugify = require('slugify')
const TypeModel =require("../model/typeModel")

    exports.getTypes =asyncHandler(async(req,res) => {
        const page = req.query.page *1 || 1;
        const limit= req.query.limit *1 || 2;
        const skip =(page-1)*limit
        const types=await TypeModel.find({}).skip(skip).limit(limit)
        res.status(200).json({resultat : types.length, page ,data:types})
    })

    exports.getType = asyncHandler(async(req,res) => {
        const {id} =req.params;
        const type = await TypeModel.findById(id)
        if(!type){
            res.status(404).json({msg:`no type for this id ${id}`})
        }
        res.status(200).json({data:type})


    })

    exports.createType = asyncHandler (async (req,res) => {
        const name = req.body.name
        //async await
        const type = await TypeModel.create({ name , slug:slugify(name) })
        res.status(201).json({data:type});
    })

    exports.updateType=asyncHandler(async(req,res)=> {
        const {id} =req.params;
        const name =req.body.name;
        const type = await TypeModel.findOneAndUpdate({_id :id},{name,slug:slugify(name)} ,{new : true})
        if(!type){
            res.status(404).json({msg:`no type for this id ${id}`})
        }
        res.status(200).json({data:type})
    })

    exports.deleteType =asyncHandler(async(req,res) => {
        const {id}=req.params;
        const type= await TypeModel.findOneAndDelete({_id:id})
        if(!type){
            res.status(404).json({msg:`no type for this id ${id}`})
        }
        res.status(200).send()

    })

