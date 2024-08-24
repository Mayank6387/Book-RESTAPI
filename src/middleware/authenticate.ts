import { config } from "../config/config";
import { NextFunction,Request,Response} from "express";
import createHttpError from "http-errors";

import {verify} from 'jsonwebtoken'

export interface AuthRequest extends Request{
    userId:string
}

const authenticate=(req:Request,res:Response,next:NextFunction)=>{

    const token=req.header("Authorization");

    if(!token){
        return next(createHttpError(401,"Authorization Token is Required"))
    }

   try{
    const parsedToken=token.split(" ")[1];

    const decodeToken=verify(parsedToken,config.jwtSecretKey as string);

    const _req=req as AuthRequest;

    _req.userId=decodeToken.sub as string;
    
    next();
   }catch(err){
    console.log(err);
    return next(createHttpError(401,"Token is Expired"))
   }
}


export default authenticate;