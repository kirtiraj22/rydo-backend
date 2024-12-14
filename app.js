require("dotenv").config();
require("express-async-errors")

const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 100;

const express = require("express")
const http = require("http");
const socketIo = require("socket.io")
const connectDB=require("./config/connect");
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/authentication");

const authRouter = require("./routes/auth")
const rideRouter = require("./routes/ride")

const handleSocketConnection = require("./controllers/sockets");

const app = express();
app.use(express.json());
const server = http.createServer(app)

const io = socketIo(server, {
    cors: {
        origin: "*"
    }
})

app.use((req, res, next) => {
    req.io = io;
    return next();
})

handleSocketConnection(io);

app.use("/auth", authRouter);
app.use("/ride", authMiddleware, rideRouter);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

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