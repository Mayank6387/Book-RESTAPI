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
    
        res.status(201).json({accessToken:token,message:"Register Successfull"});
    } catch (error) {
        return next(error);
    }
}

const login=async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return next(createHttpError(400,"All fields are required"));
    }

    try{
        const getUser=await userModel.findOne({email:email});

        if(!getUser){
            return next(createHttpError(404,"User Not Found"));
        }

        const isMatch=await bcrypt.compare(password,getUser.password);

        if(!isMatch){
            return next(createHttpError(400,"Username or Password Incorrect"))
        }
        const token=sign({sub:getUser._id},config.jwtSecretKey as string,{expiresIn:"7d"});
    
        res.status(201).json({accessToken:token,message:"Login Successfull"});
    }catch(err){
        return next(err);
    }

}

export {createUser,login};