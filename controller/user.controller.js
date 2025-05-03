import bcrypt from "bcrypt"
import User from "../model/user.model.js"
import cloudinary from "../config/cloudinary.js"
import jwt from "jsonwebtoken"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
const JWT_SECRET = process.env.JWT_SECRET

export const Signup = async (req, res) => {
    try {
        const {
            channelName,
            phone,
            email,
            password
        } = req.body;
        const hashSalt = await bcrypt.genSalt(10)

        const uploadImage = await cloudinary.uploader.upload(
            req.files.logoUrl.tempFilePath
        )
        console.log(uploadImage)

        const hashedPassword = await bcrypt.hash(password, hashSalt)

        const newUser = await User.create({
            channelName,
            email,
            phone,
            logoUrl: uploadImage.secure_url,
            password: hashedPassword,
            logoId: uploadImage.public_id,
        })
        let token = jwt.sign({
            userId: newUser._id
        }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        })
        if (!newUser) {
            const error = new Error("Error while creating user")
            error.status = 404
            throw error;
        }

        await newUser.save()
        res.status(201).json({
            success: true,
            data: newUser,
            token,
        })

    } catch (error) {
        console.log("Connot sigup!!")
        throw error

    }

}
export const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const existinguser = await User.findOne({
            email
        })

        if (!existinguser) {
            const error = new Error("User Not Existed")
            error.statusCode = 404
            throw error;
        }

        const isValid = await bcrypt.compare(password, existinguser.password)

        if (!isValid) {
            res.status(404).json({
                success: false,
                message: "User not found! invalid credential"
            })

        }


        const token = jwt.sign({
            userId: existinguser._id
        }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        })

        res.status(200).json({
            success: true,
            msg: "user Signed In successfully",
            data: {
                token,
                existinguser,
            }
        })



    } catch (error) {
        console.log("error at login!")
        throw error.message

    }
}

export const updateProfle = async (req,res) => {
    try {
        const {channelName,phone} = req.body
        let updateData = {channelName,phone}
        if(req.files && req.files.logoUrl){
            const uploadedImage = await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath) 
            updateData.logoUrl = uploadedImage.secure_url
            updateData.logoId = uploadedImage.public_id
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id,updateData,{new:true})

        res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            data:updatedUser
        })
    } catch (error) {
        console.log("Error Occured at updateProfile")
        throw error.message;
        
    }
    
}
export const subscribeUser = async (req,res) => {
    try {
        const {channelId} = req.body
        if(req.user._id === channelId){
            return res.status(403).json({
                success:false,
                message:"You Cannot Subscribe t yourself"
            })
        }
        
        
        const user = await User.findById(req.user._id)         
        const isSubscribed = user.subscribedChannels.includes(channelId)
        console.log(isSubscribed)
        if(!isSubscribed){
            const updatedUser = await User.findByIdAndUpdate(req.user._id,{$addToSet:{subscribedChannels:channelId}},{new:true})
            await User.findByIdAndUpdate(channelId,{$inc:{subscribers:1}})

        }

        res.status(200).json({
            success:true,
            message:"Subscribed Succesfully",
            
        })

    } catch (error) {
        console.log("Error Occurred at Subscribe A User")
        throw error.message
        
    }
    
}