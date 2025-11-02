import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import db from "./utils/db-connect.js";

dotenv.config();

const app = express()


app.use(cors(
    {
        origin: process.env.BASE_URL,
        credentials : true,
        methods : ['GET' , 'POST' , 'PUT' , 'DELETE'],
        allowedHeaders : ['Content-Type' , 'Authorization']
    }
)) 

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/tarun' , (req,res) => {
    res.send("Hello Tarun!")
})


//connect to db
db();


console.log("PORT value:", process.env.PORT);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
