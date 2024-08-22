import { NextFunction,Response,Request } from "express"
const createBook=(req:Request,res:Response,next:NextFunction)=>{
    res.json({message:"hey"})
}

export {createBook}