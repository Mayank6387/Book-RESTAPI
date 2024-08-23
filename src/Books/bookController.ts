import { NextFunction,Response,Request } from "express"
import cloudinary from "../config/cloudinary";
import path from "path";
import createHttpError from "http-errors";

const createBook=async(req:Request,res:Response,next:NextFunction)=>{
   try{
    const files=req.files as {[fieldname:string]:Express.Multer.File[]};

    const coverImageMimeType=files.coverImage[0].mimetype.split("/").at(-1);

    const imageName=files.coverImage[0].filename;

    const imagePath=path.resolve(__dirname,"../../public/data/uploads",imageName);

    const upload = await cloudinary.uploader.upload(imagePath,{
        filename_overrirde:imageName,
        folder:"book-covers",
        format:coverImageMimeType
       })
     
       console.log(upload);

       const bookName=files.file[0].filename;
       const bookPath=path.resolve(__dirname,"../../public/data/uploads",bookName);

       const bookUpload = await cloudinary.uploader.upload(bookPath,{
        filename_overrirde:bookName,
        folder:"book-pdfs",
        format:"pdf",
        resource_type:"raw"
       })

       console.log(bookUpload)
    
        res.json({})

    }catch(err){
        console.log(err);
        return next(createHttpError(500,"Error in Uploading Files to Cloud"))
    }
}



export {createBook}