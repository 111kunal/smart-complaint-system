import { Route } from "express";
import { createAgent } from "../controllers/authController";
import {Protect, authorize} from '../middleware/authMiddleware';

const router = Router();

router.post('/create-agent', Protect, authorize('admin'), createAgent);

export default router;