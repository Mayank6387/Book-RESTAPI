import { config as conf } from "dotenv";

conf();

const _config={
    port:process.env.PORT,
    databaseUrl:process.env.MONGO_CONNECTION_STRING,
    jwtSecretKey:process.env.JSON_SECRET_KEY
}


export const config=Object.freeze(_config);