import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts);          // public
router.get("/:id", getPostById);    // public
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
