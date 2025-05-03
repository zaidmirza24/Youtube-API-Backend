import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import {AllVideos, likeVideo, updateVideo, uploadVideo} from "../controller/video.controller.js"


const videoRouter = Router()
//upload video
videoRouter.post('/upload',authorize,uploadVideo)
videoRouter.put('/upload/:id',authorize,updateVideo)
videoRouter.post('/:id/like',authorize,likeVideo)
videoRouter.get('/',authorize,AllVideos)

export default videoRouter;