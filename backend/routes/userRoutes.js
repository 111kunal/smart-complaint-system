import { Router } from "express";
import { createAgent, getAgents } from "../controllers/authController.js";
import {protect, authorize} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create-agent', protect, authorize('admin'), createAgent);
router.get('/agents', protect, authorize('admin'), getAgents);

export default router;