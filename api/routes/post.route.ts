import { Router } from "express";

import {
  createPost,
  deletePost,
  getPost,
  getPostById,
  updatePost,
} from "../controllers/post.controller.ts";
import { verifyToken } from "../middlewares/verify-token.ts";

const router = Router();

router.get("/", getPost);
router.get("/:id", getPostById);
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
