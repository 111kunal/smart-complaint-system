import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';
import Complaint from '../models/complaint.js';

//@route GET /api/admin/agents (admin only)
export const getAgents = async (req, res) => {
  try{
    const agents = await User.find({role: 'agent'}).select('-password');
    res.status(200).json(agents);
  } catch(error){
    res.status(500).json({message:error.message});
  }
};

// @route  POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    if(error.name === 'ValidationError'){
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({message: messages.join(', ')});
    }
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'This account has been deactivated' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/create-agent (admin only)

export const createAgent = async (req,res) => {
  try{
    const {name , email , password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({message:'Please fill in all the fields'});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message:'Email already registered'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const agent = await User.create({
      name,
      email,
      password:hashedPassword,
      role:'agent',
    });

    res.status(201).json({
      _id:agent._id,
      name:agent.name,
      email:agent.email,
      role:agent.role,
    });
  } catch(error){
    res.status(500).json({message: error.message});
  }
};

// @route  PATCH /api/admin/agents/:id/toggle-status   (admin only)
export const toggleAgentStatus = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({ message: 'This user is not an agent' });
    }

    agent.status = agent.status === 'Active' ? 'Inactive' : 'Active';
    await agent.save();

    res.status(200).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      role: agent.role,
      status: agent.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/admin/agents/:id   (admin only)
export const deleteAgent = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({ message: 'This user is not an agent' });
    }

    // unassign any complaints currently assigned to this agent, send them back to Open
    await Complaint.updateMany(
      { assignedAgent: agent._id },
      { $set: { assignedAgent: null, status: 'Open', assignedDate: null } }
    );

    await agent.deleteOne();

    res.status(200).json({ message: 'Agent removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};