require("dotenv").config();

const express = require("express")
const http = require("http");
const connectDB=require("./config/connect");

const app = express();
app.use(express.json());
const server = http.createServer(app)

const main = async () => {
    try{
        server.listen(process.env.PORT || 3000,"0.0.0.0",async () => {
            console.log(`HTTP server is running on port http://localhost:${process.env.PORT || 3000}`) 
        })

        await connectDB(process.env.MONGO_URI).then((data) => {
            console.log(`Mongodb is connected at ${data?.connection?.host}`)
        })
    }catch(error){
        console.log(error);
    }
}

main();