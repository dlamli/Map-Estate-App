import { Router } from "express";

import { addMessage } from "../controllers/message.controller.ts";
import { verifyToken } from "../middlewares/verify-token.ts";


const router = Router();

router.post("/:chatId", verifyToken, addMessage);

export default router;
