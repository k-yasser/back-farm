const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            trim : true ,
            required : [ true , "name required"],
        },
        slug : {
            type : String,
            lowercase : true,
        },
        phone : String,
        email :{
            type : String,
            required : [true , 'email ies required '],
            unique : true,
            lowercase : true,
        },
        password : {
            type : String, 
            required : [true , "password is required "],
            minlength : [6 , "minimum 6 caractere"]
        }, 
        role : {
            type :String,
            enum : ['user','admin'],
            default : 'user',
        }
    },{timestamps : true}
)

userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12)
    next();
})


const user = new mongoose.model('User',userSchema)

module.exports=user