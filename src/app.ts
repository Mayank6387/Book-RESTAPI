import express from 'express'
import globalErrorHandler from './middleware/globalErrorHandler';

const app=express();


app.get('/',(req,res)=>{
    res.json({message:"hey"})
})


app.use(globalErrorHandler);








export default app;