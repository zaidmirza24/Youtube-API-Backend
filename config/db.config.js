import mongoose from "mongoose";
import dotenv from "dotenv"
const ConnectDB = async () => {
    try {

        const db = await mongoose.connect(process.env.MONGO_URI)
        if(db){

            console.log(`DB Successfully Connnected `)
        }
        
    } catch (error) {
        console.log(error.message)
        throw new Error("Something went wrong",error)
        
    }
}

export default ConnectDB;