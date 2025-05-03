import mongoose from "mongoose";

import cloudinary from "../config/cloudinary.js";
import User from "../model/user.model.js";
import Video from "../model/video.model.js";


export const uploadVideo = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            tags
        } = req.body
        if (!req.files || !req.files.videoUrl.tempFilePath || !req.files.thumbnailUrl.tempFilePath) {
            return res.status(404).json({
                error: "Video and thumbnail are required"
            })
        }

        const videoupload = await cloudinary.uploader.upload(req.files.videoUrl.tempFilePath, {
            resource_type: "video",
            folder: "videos"
        })
        const ThumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnailUrl.tempFilePath, {
            folder: "thumbnails"
        })

        const video = await Video.create({
            title,
            description,
            user_id: req.user._id,
            videoUrl: videoupload.secure_url,
            videoId: videoupload.public_id,
            thumbnailUrl: ThumbnailUpload.secure_url,
            thumbnailId: ThumbnailUpload.public_id,
            category,
            tags: tags ? tags.split(",") : [],
        })

        await video.save()

        res.status(200).json({
            success: true,
            data: video
        })



    } catch (error) {
        console.log("Error at upload video")
        throw error.message

    }
}

export const updateVideo = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            tags
        } = req.body
        const videoId = req.params.id

        // Find video by id
        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            })
        }

        if (video.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: "Unauthorized"
            })
        }
        if (req.files && req.files.thumbnails) {
            await cloudinary.uploader.destroy(video.thumbnailId)

            const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnails.tempFilePath, {
                folder: "thumbnails"
            })
            video.thumbnailUrl = thumbnailUpload.secure_url
            video.thumbnailId = thumbnailUpload.public_id

        }
        video.title = title || video.title
        video.description = description || video.description
        video.category = category || video.category
        video.tags = tags.split(",") || video.tags

        await video.save()
        res.status(200).json({
            success: true,
            message: "Video Updated Succesfully"
        })



    } catch (error) {
        console.log("Error occured at update Video")
        throw error.message

    }
}
export const likeVideo = async (req, res) => {
    try {
        const videoId = req.params.id; // MongoDB _id
        const userId = req.user._id; // Authenticated user id

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        // Check if user already liked
        const alreadyLiked = video.likedBy.includes(userId);

        if (alreadyLiked) {
            // Optional: toggle like (remove like)
            video.likedBy.pull(userId);
        } else {
            video.likedBy.push(userId);
            // Also remove from dislikedBy if previously disliked
            video.disLikedBy.pull(userId);
        }

        await video.save();

        res.status(200).json({
            success: true,
            message: alreadyLiked ? "Like removed" : "Video liked",
            likes: video.likedBy.length,
        });
    } catch (error) {
        console.log("Error in likeVideo:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
export const AllVideos = async (req, res) => {
    try {
        const videos = await Video.find()
        console.log(videos)
        if (!videos) {
            return res.status(403).json({
                success: false,
                message: "Videos Not Found"
            })
        }
        res.status(200).json({
            success: true,
            data: videos
        })
    } catch (error) {
        console.log("Error Occured At Getting all Videos")
        throw error.message

    }
}