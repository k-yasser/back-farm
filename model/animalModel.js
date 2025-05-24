const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({

    rfid: {
    type: String,
    required: true,
    unique: true
},


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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // <-- fix this to refer to your actual user/farmer model
        required: [true, 'animal must belong to a farmer']
    },
    status: {
    type: String,
    enum: ['pending', 'verified', 'non-available'],
    default: 'pending'
}
}, { timestamps: true });

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
