import { Router } from "express";
import { deleteUserById, getUserById, getUsers, updateUserById } from "../controllers/user.controller.ts";
import { verifyToken } from "../middlewares/verify-token.ts";


const router = Router();

router.get("/", getUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUserById);
router.delete("/:id", verifyToken, deleteUserById);

export default router;
