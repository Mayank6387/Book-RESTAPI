import { config } from './config'
import mongoose from 'mongoose'

const connectDB=async()=>{
    try{
        mongoose.connection.on('connected',()=>{
            console.log("connected to db sucessfully")
        })

        mongoose.connection.on('error',(err)=>{
            console.log("Error in connection to db",err);
        })
        
        await mongoose.connect(config.databaseUrl as string)


    }
    catch(err){
        console.error("Failed to connect to databse",err);

        process.exit(1);
    }
}

export default connectDB;