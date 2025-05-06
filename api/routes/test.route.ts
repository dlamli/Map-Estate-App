import { Router } from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.ts";
import { verifyToken } from "../middlewares/verify-token.ts";

const router = Router();

router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);
router.get("/should-be-admin", shouldBeAdmin);

export default router;