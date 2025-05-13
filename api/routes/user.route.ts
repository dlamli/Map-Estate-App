import { Router } from "express";
import { deleteUserById, getNotificationNumber, getUserById, getUsers, profilePosts, savePost, updateUserById } from "../controllers/user.controller.ts";
import { verifyToken } from "../middlewares/verify-token.ts";


const router = Router();

router.get("/", getUsers);
// router.get("/:id", verifyToken, getUserById);
router.post("/save", verifyToken, savePost);
router.put("/:id", verifyToken, updateUserById);
router.delete("/:id", verifyToken, deleteUserById);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);

export default router;
