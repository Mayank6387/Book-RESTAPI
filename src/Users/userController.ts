import { Request,Response,NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt"
import {sign} from "jsonwebtoken"
import { config } from "../config/config";

const createUser=async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password}=req.body;
    //Validation
    
    if(!name || !email ||!password){
        const error=createHttpError(400,"All fields are required");
        return next(error)
    }
    
    try {
        
        let user=await userModel.findOne({email:email});
        if(user){
            const error=createHttpError(400,"User Already Exists");
            return next(error);
        }
        const salt=await bcrypt.genSalt();
        const hashPassword=await bcrypt.hash(password,salt);
        user=await userModel.create({
            name,
            email,
            password:hashPassword
        }) 
    
        const token=sign({sub:user._id},config.jwtSecretKey as string,{expiresIn:"7d"});
    
        res.json({accessToken:token});
    } catch (error) {
        return next(createHttpError(500,"Error in Creation Of User"))
    }
}


export {createUser};