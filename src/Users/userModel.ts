import {User} from './userTypes';
import mongoose from "mongoose";


const userSchema=new mongoose.Schema<User>({
    name:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    }
},{timestamps:true})

export default mongoose.model<User>('user',userSchema)