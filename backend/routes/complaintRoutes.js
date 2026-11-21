import { Router } from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  closeComplaint,
  reopenComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, authorize('user'), createComplaint);
router.get('/', protect, getComplaints);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, authorize('agent', 'admin'), updateComplaintStatus);
router.patch('/:id/assign', protect, authorize('admin'), assignComplaint);
router.patch('/:id/close', protect, authorize('user', 'admin'), closeComplaint);
router.patch('/:id/reopen', protect, authorize('admin'), reopenComplaint);
router.delete('/:id', protect, authorize('admin'), deleteComplaint);

export default router;