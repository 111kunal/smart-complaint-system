import Complaint from '../models/complaint.js';

// @route  POST /api/complaints   (logged-in users only)
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      submitter: req.user._id, // comes from the protect middleware
    });

    res.status(201).json(complaint);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/complaints   (role-based visibility)
export const getComplaints = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'user') {
      filter = { submitter: req.user._id };
    } else if (req.user.role === 'agent') {
      filter = { assignedAgent: req.user._id };
    }
    // admin sees everything — filter stays {}

    const complaints = await Complaint.find(filter)
      .populate('submitter', 'name email')
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/complaints/:id
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('submitter', 'name email')
      .populate('assignedAgent', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // ownership check
    if (
      req.user.role === 'user' &&
      complaint.submitter._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    if (
      req.user.role === 'agent' &&
      (!complaint.assignedAgent || complaint.assignedAgent._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PATCH /api/complaints/:id/status   (agent, admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Open', 'In Progress', 'Pending', 'Resolved'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // an agent can only update complaints assigned to them
    if (
      req.user.role === 'agent' &&
      (!complaint.assignedAgent || complaint.assignedAgent.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PATCH /api/complaints/:id/assign   (admin only)
export const assignComplaint = async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: 'agentId is required' });
    }

    const agent = await User.findById(agentId);

    if(!agent) {
        return res.status(404).json({message:"Agent not found"});
    }

    if(agent.role !== 'agent'){
        return res.status(400).json({message:'Selected user is not an agent'});
    }

    if(agent.status === 'Inactive'){
        return res.status(400).json({message:'Cannot assign to an inactive agent'})
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedAgent = agentId;
    complaint.assignedDate = new Date();
    complaint.status = 'In Progress';
    await complaint.save();

    const updated = await complaint.populate('assignedAgent', 'name email');
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};