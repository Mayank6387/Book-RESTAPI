import express from "express";
import { createBook, deleteBook, getAllBooks, getSingleBook, updateBook } from "./bookController";
import path from 'node:path'
import multer from 'multer'
import authenticate from "../middleware/authenticate";

const bookRouter=express.Router();

const upload=multer({
    dest:path.resolve(__dirname,'../../public/data/uploads'),
    limits:{fileSize:3e7} //30mb
})

bookRouter.post('/',authenticate,upload.fields([

    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}
    
]),createBook)

bookRouter.patch('/:bookId',authenticate,upload.fields([

    {name:'coverImage',maxCount:1},
    {name:'file',maxCount:1}
    
]),updateBook)


bookRouter.get('/',getAllBooks)


bookRouter.get('/:bookId',getSingleBook)

bookRouter.delete('/:bookId',authenticate,deleteBook)



export default bookRouter;