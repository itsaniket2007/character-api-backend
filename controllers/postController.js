import mongoose from "mongoose";
import Post from "../models/Post.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE  POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { name, description, series, imageUrl } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "name and description are required" });
    }
    const post = await Post.create({ name, description, series, imageUrl, user: req.user._id });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ ALL  GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username").sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ ONE  GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid post id" });

    const post = await Post.findById(req.params.id).populate("user", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE  PUT /api/posts/:id  (only the owner)
export const updatePost = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid post id" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    const { name, description, series, imageUrl } = req.body;
    if (name !== undefined) post.name = name;
    if (description !== undefined) post.description = description;
    if (series !== undefined) post.series = series;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;

    const updated = await post.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE  DELETE /api/posts/:id  (only the owner)
export const deletePost = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid post id" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
