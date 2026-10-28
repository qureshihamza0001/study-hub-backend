
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import * as quizzesController from "./quizzes.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", quizzesController.create);
router.get("/", quizzesController.getAll);
router.get("/:id", quizzesController.getOne);
router.patch("/:id", quizzesController.update);
router.delete("/:id", quizzesController.remove);

export default router;
