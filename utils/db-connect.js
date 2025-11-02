import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// export a function that connects to db

const db_connect = () => {

    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connected to mongodb succesfully");
    })
    .catch((err)=>{"Error connecting to MongoDB: " , err});
}

export default db_connect; 