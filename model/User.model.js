import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        role: {
            type:String,
            enum: ["user" , "admin"], //select only one of these two
            default: "user"
        },
        isVerified : {
            type: Boolean,
            default: false,
        },
        verificationToken : {
            type: String,
        },
        resetPasswordToken : {
            type: String,
        },
        resetPasswordExpires : {
            type: Date,
        },
    }
 , {
    timestamps: true, //by Doing this mongoose is making createdAt , updatedAt
   }
);


const User =  mongoose.model("User" , userSchema) //User is a model based on userSchema

//in db , User -> lowercase , plural by MongoDB

export default User

