import jwt from "jsonwebtoken"
import User from "../model/user.model.js"


const JWT_SECRET = process.env.JWT_SECRET

export const authorize = async (req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if(!token){
            const error = new Error("No token is Provided")
            error.statuCode = 404
            throw error
        }

        const decoded = jwt.verify(token,JWT_SECRET)

        const user = await User.findById(decoded.userId)
        if(!user) return res.status(401).json({message:"Unauthorized"})

        req.user = user

        next()
        
    } catch (error) {
        console.log("Error at athorization")
        throw error
        
    }
}