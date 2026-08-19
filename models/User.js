const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    favorites:[
        {
            id:Number,
            type:String,
            title:String,
            poster:String,
            rating:Number
        }
    ]

},
{
    timestamps:true
});


module.exports = mongoose.model(
    "User",
    userSchema
);