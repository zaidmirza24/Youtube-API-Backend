import { Router } from "express";
import { login, Signup, subscribeUser, updateProfle } from "../controller/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const userRouter = Router()

userRouter.post('/signup',Signup)
userRouter.post('/login',login)
userRouter.put('/update-profile',authorize,updateProfle)
userRouter.post("/subscribe",authorize,subscribeUser)

 export default userRouter 