import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
 firstName:{
    type: String,
    required: true,
    lowercase: true
 },
 lastName:{
    type: String,
    required: true,
    lowercase: true
 },
 emailId:{
    type: String,
    required: true,
    unique: true,
    trim: true
 },
 password:{
    type: String,
    required: true,
 },
 age:{
    type: Number,
    required: true,
 },
 gender:{
    type: String,
    required: true,
 },photo:{
  type: String // store base64 encoded data
 }

},{
    timestamps: true
})


userSchema.methods.getJWT = async function()
{
    const user  = this
    const token = await jwt.sign({_id: user._id},  process.env.JWT_SECRET, {
        expiresIn:'7d'
    })
    console.log('token', token );
    return token
}


export const User = mongoose.model('User', userSchema)