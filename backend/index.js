const express = require("express")
const dotenv = require("dotenv")
const connection = require("./db")
const cookieParser = require("cookie-parser")

const {app, server} = require("./socket/server")
dotenv.config()
const cors = require("cors");
const router = require("./routes/user.routes")
const messagerouter = require("./routes/message.routes")

app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/user", router)
app.use("/message", messagerouter);

server.listen(process.env.PORT || 3030, async ()=> {
    try {
        await connection
        console.log(`server running port on ${process.env.PORT || 3030}`);
        console.log("<<<<< Database is connected >>>>>")
    } catch (error) {
        console.log(error);
    }
})