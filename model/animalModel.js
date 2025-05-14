const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({

    name:{
        type:String
    },

    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'type', 
        required: [true,'animal must belong to type']
    },
    slug : {
        type : String ,
        required : true,
        lowercase: true
    },
    age: {
        type: Number,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    gender:{
        type:String,
        enum:['male','female'],
        default:'male'
    },
    vaccin:Boolean,
    owner: {
        type: String
    }
}, { timestamps: true });

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
