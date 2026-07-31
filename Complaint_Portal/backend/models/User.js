const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true,
        },
        email : {
            type : String,
            required: true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        googleId : {
            type : String,
            required : true,
            unique : true,
        },
        profilePicture : { 
            type : String,
            default : "",
        },
        role : {
            type : String,
            enum: ["SUPER_ADMIN" , "ADMIN" , "EDITOR"],
            default : "EDITOR",
        },
        isActive : {
            type : Boolean,
            default : true,
        },
        lastLogin: {
            type : Date,
        },
    },
    {
        timestamps : true,
    }
)

const User = mongoose.model("User", userSchema)


module.exports = User;