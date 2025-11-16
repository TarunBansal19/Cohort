import User from "../model/User.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sendVerificationEmail from "../utils/send-verificationEmail.js";
import jwt from "jsonwebtoken"
dotenv.config();

const registerUser = async (req, res) => {
    //res.send("Registered");
    //get data 
    const { name, email, password } = req.body;
    //validate data
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log(req.body)
    console.log(email)

    console.log("test")
    if (!email.includes("@")) {
        return res.status(400).json(
            {
                message: "Invalid Email Provided"
            }
        )
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    //check user exist

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists. Please login"
            })
        }

        //create new user in db

        const user = await User.create({
            name,
            email,
            password,
        })
        console.log(user)
        if (!user) {
            return res.status(500).json({
                message: "Error creating user. please try again later"
            })
        }
        //generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        console.log(verificationToken)

        //save token in db
        user.verificationToken = verificationToken;
        await user.save();

        console.log(user);

        //send email to user
        sendVerificationEmail(user.email , "Verify your email" , `Please click on the following link:
    ${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`)

        //send success response to user
        return res.status(201).json({
            message: "User registered succesfully. Please check your email to verify your account",
            sucess: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            sucess: false,
            error: error.message
        })
    }

};

const verifyUser = async (req , res) => 
{
    //get token from url
    const {token} = req.params;
    //validate token
    if(!token) return res.status(400).json({message: "Invalid token"})
    console.log("Token : "  , token)
    //find user with token
    const user = await User.findOne({verificationToken: token})
    if(!user) return res.status(400).json({message: "Invalid User or Token"})
    //if user not found , isVerified = false
    //if user found  , isVerified = true
    user.isVerified = true;
    //remove token from db
    user.verificationToken = undefined;
    //save user
    await user.save();
    //return response
    return res.status(200).json({message: "User verified succesfully"})
}

const loginUser = async (req , res) => {

    const {email , password} =req.body;
    //validate data
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    //check user exist
    try{
        const user = await User.findOne({email});
        if(!user){
        return res.status(404).json({message: "User not found. Please register"});
        }
        //check password
        const isMatch = await bcrypt.compare(password , user.password)
        console.log(isMatch)

        if(!isMatch){
            return res.status(401).json({message: "Invalid credentials"});
        } 
        else console.log("User email and password matched")

        //if user is there but not verified
        if(!user.isVerified){
            return res.status(401).json({message: "User not verified. Please verify your email"})
        } else console.log("User is verified")

        //generate jwt token
        const token = jwt.sign({id : user._id} , "shhh" , {expiresIn : "24h"})
        console.log("Generated JWT token:" , token)
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24*60*60*1000
        }

        //get token in cookie

        res.cookie("token" , token , cookieOptions)

        //send success response
        return res.status(200).json({message: "Login succesfull" , user : {
            id : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        } , token});

    }catch(error){
        return res.status(500).json({message: "Internal Server Error" , error : error.message});
    }
}
export { registerUser }
export { verifyUser }
export { loginUser}

