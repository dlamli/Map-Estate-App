import { Router } from "express";

import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "../controllers/post.controller.ts";

const router = Router();

router.get("/", getPost);
router.post("/", createPost);
router.put("/", updatePost);
router.delete("/", deletePost);

export default router;
