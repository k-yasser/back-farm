const mongoose = require('mongoose')

//schema
const TypeSchema = mongoose.Schema({
    name : {
        type : String,
        required:[true , 'name is required'] ,
        unique : [true ,'must be unique'],
    },
    slug :{
        type: String,
        lowercase: true,
    },
    img: String
},
{timestamps : true},
)

const TypeModel =mongoose.model('type', TypeSchema);


module.exports=TypeModel