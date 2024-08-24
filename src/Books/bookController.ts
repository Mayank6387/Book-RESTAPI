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



const updateBook=async(req:Request,res:Response,next:NextFunction)=>{
    const {title,genre}=req.body;
    const bookId=req.params.bookId;

    const book=await bookModel.findOne({_id:bookId});

    if(!book){
        return next(createHttpError(404,"Book Not Found"))
    }
    const _req=req as AuthRequest;
    if(book.author.toString()!=_req.userId){
        return next(createHttpError(403,"You cannot Update other's book"));
    }


    const files=req.files as {[fieldname:string]:Express.Multer.File[]};
    let completecoverImage="";

    if(files.coverImage)  
    {
    const coverImageMimeType=files.coverImage[0].mimetype.split("/").at(-1);

    const imageName=files.coverImage[0].filename;

    const imagePath=path.resolve(__dirname,"../../public/data/uploads",imageName);
    
    completecoverImage=imageName;

    const imageupload = await cloudinary.uploader.upload(imagePath,{
        filename_overrirde:completecoverImage,
        format:coverImageMimeType,
        folder:"book-covers",
       })
       completecoverImage=imageupload.secure_url;

       await fs.promises.unlink(imagePath);
    }

      let completebookname="";

       if(files.file){
        const bookName=files.file[0].filename;
       const bookPath=path.resolve(__dirname,"../../public/data/uploads",bookName);
       completebookname=bookName;
       const bookUpload = await cloudinary.uploader.upload(bookPath,{
        filename_overrirde:completebookname,
        folder:"book-pdfs",
        format:"pdf",
        resource_type:"raw"
       })


       completebookname=bookUpload.secure_url;
       await fs.promises.unlink(bookPath);

       }

       const updateBook=await bookModel.findOneAndUpdate({
        _id:bookId
       },{
        title:title,
        genre:genre,
        coverImage:completecoverImage?completecoverImage:book.coverImage,
        file:completebookname?completebookname:book.file,
       },{new:true})

       res.json(updateBook);


    
}


const getAllBooks=async(req:Request,res:Response,next:NextFunction)=>{

   try {
    const list=await bookModel.find();
    res.json(list);
    
   } catch (error) {
    console.log(error);
    return next(createHttpError(500,"Error While Getting All Books"))
   }
}

const getSingleBook=async(req:Request,res:Response,next:NextFunction)=>{
    const bookId=req.params.bookId;
    try {
     const book=await bookModel.findOne({_id:bookId});
     if(!book){
        return next(createHttpError(404,"Book Not Found"))
     }
     return res.json(book)
     
    } catch (error) {
     console.log(error);
     return next(createHttpError(500,"Error While Getting Book"))
    }
 }

export {createBook,updateBook,getAllBooks,getSingleBook}