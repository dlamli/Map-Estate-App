import { Router } from "express";

import { addChat, getChatById, getChats, readChat } from "../controllers/chat.controller.ts";
import { verifyToken } from "../middlewares/verify-token.ts";


const router = Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChatById);
router.post("/:id", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);

export default router;
