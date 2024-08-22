import express from "express";
import { createUser, login } from "./userController";


const userRouter=express.Router();


userRouter.post('/register',createUser)
userRouter.get('/login',login)


export default userRouter;