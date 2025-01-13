import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import Post from '../models//posts.model.js'
import bcrypt from "bcrypt"
import Comment from '../models/comment.model.js'

export const check = (req, res) => {
    return res.status(200).json({message: "running"})
}

export const createPost = async (req, res) => {
    const {token} = req.body;

    try {
        const user = await User.findOne({token})
        if (!user) {
            return res.status(404).json({message: "user does not exists"})
        }

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
        });

        await post.save();

        return res.status(200).json({message: "post created"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({active: true}).populate('userId', 'name username email profilePicture');
        return res.json(posts);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const deletePost = async (req, res) => {
    const {token, post_id} = req.body;

    try {
        const user = await User.findOne({token: token}).select("_id");
        if (!user) {
            return res.status(404).json({message: "user does not exists"})
        }

        const post = await Post.findOne({_id: post_id})
        if (!post) {
            return res.status(404).json({message: "post does not exists"})
        }

        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({message: "Unauthorized"})
        }

        post.active = false;

        await post.save();

        return res.json({message:"post deleted"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const get_commnets_by_post = async (req, res) => {
    const {post_id} = req.query;

    try {
        const post = await Post.findOne({_id: post_id});

        if(!post){
            return res.status(404).json({message: "post not found"});
        }

        const comment = await Comment.find({postId: post._id}).populate("userId","username name profilePicture");

        if(!comment){
            return res.status(404).json({message: "comment not found"});
        }

        const comments = comment.reverse()

        return res.status(200).json({comments});
        
    } catch (error) {
        return res.status(500).json({message1: error.message})
    }
}

export const delete_comment_of_user = async (req, res) => {
    const {token, comment_id} = req.body;

    try {
        const user = await User.findOne({token: token});

        if(!user){
            return res.status(404).json({message: "user not found"});
        }

        const comment = await Comment.findOne({_id: comment_id});

        if(!comment){
            return res.status(404).json({message: "comment not found"});
        }

        if(comment.userId.toString() !== user._id.toString()){
            return res.status(404).json({message: "Unauthorized"});
        }        

        await Comment.deleteOne({"_id": comment_id})

        return res.json({message: "Comment deleted"});
    } catch (error) {
        return res.status(500).json({message1: error.message})
    }
}

export const increment_likes = async (req, res) => {
    const {post_id} = req.body;

    try {
        const post = await Post.findOne({_id: post_id});

        if(!post){
            return res.status(404).json({message: "post not found"});
        }

        post.likes = post.likes +1;

        await post.save();

        return res.json({message: "Likes incremented"});
        
    } catch (error) {
        return res.status(500).json({message1: error.message})
    }
}