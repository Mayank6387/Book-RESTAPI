import { NextFunction,Response,Request } from "express"
import cloudinary from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs"
import { AuthRequest } from "../middleware/authenticate";

const createBook=async(req:Request,res:Response,next:NextFunction)=>{

    const {title,genre}=req.body;

   try{
    const files=req.files as {[fieldname:string]:Express.Multer.File[]};

    const coverImageMimeType=files.coverImage[0].mimetype.split("/").at(-1);

    const imageName=files.coverImage[0].filename;

    const imagePath=path.resolve(__dirname,"../../public/data/uploads",imageName);

    const imageupload = await cloudinary.uploader.upload(imagePath,{
        filename_overrirde:imageName,
        folder:"book-covers",
        format:coverImageMimeType
       })

       const bookName=files.file[0].filename;
       const bookPath=path.resolve(__dirname,"../../public/data/uploads",bookName);

       const bookUpload = await cloudinary.uploader.upload(bookPath,{
        filename_overrirde:bookName,
        folder:"book-pdfs",
        format:"pdf",
        resource_type:"raw"
       })

    const _req=req as AuthRequest;
     const newBook=await bookModel.create({
        title:title,
        genre:genre,
        coverImage:imageupload.secure_url,
        file:bookUpload.secure_url,
        author:_req.userId
     })
      
     //Temp files deletion

     await fs.promises.unlink(imagePath);
     await fs.promises.unlink(bookPath);


        res.status(201).json({id:newBook._id})

    }catch(err){
        console.log(err);
        return next(createHttpError(500,"Error in Uploading Files to Cloud"))
    }
}



export {createBook}