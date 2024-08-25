import express from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouter from './Users/userRouter';
import bookRouter from './Books/bookRouter';
import cors from 'cors'

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: "hey"});
});

app.use("/api/users",userRouter)
app.use("/api/books",bookRouter)


app.use(globalErrorHandler);


export default app;