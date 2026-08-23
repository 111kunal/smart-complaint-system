import { Router } from "express";
import { createAgent } from "../controllers/authController.js";
import {protect, authorize} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create-agent', protect, authorize('admin'), createAgent);

export default router;