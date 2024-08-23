import { config as conf } from "dotenv";

conf();

const _config={
    port:process.env.PORT,
    databaseUrl:process.env.MONGO_CONNECTION_STRING,
    jwtSecretKey:process.env.JSON_SECRET_KEY,
    cloud:process.env.CLOUDINARY_NAME,
    cloudkey:process.env.CLOUDINARY_KEY,
    cloudsecret:process.env.CLOUDINARY_SECRET
}


export const config=Object.freeze(_config);