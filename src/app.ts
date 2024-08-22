import express from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouter from './Users/userRouter';
import bookRouter from './Books/bookRouter';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: "hey"});
});

app.use("/api/users",userRouter)
app.use("/api/books",bookRouter)


app.use(globalErrorHandler);


export default app;