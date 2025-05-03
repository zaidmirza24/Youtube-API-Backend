import express from "express"
import dotenv from "dotenv"
import fileUpload from "express-fileupload"
import bodyParser from "body-parser"

import ConnectDB from "./config/db.config.js"
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import CommentRouter from "./routes/comment.routes.js"

 
const app = express()
app.use(express.urlencoded({extended:true}))
dotenv.config()
app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"

}))

app.use("/api/v1/user",userRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/comment",CommentRouter)

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(process.env.PORT,async ()=>{
    console.log(`Server is Running at http://localhost:${process.env.PORT}`)
    await ConnectDB()
}) 