const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const { authMiddleware } = require('./auth');

// Create project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, members: [req.user.id] });
    res.json(project);
    req.app.get('io')?.emit('project:created', project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get user's projects
router.get('/', authMiddleware, async (req, res) => {
  const projects = await Project.find({ members: req.user.id }).populate('members', 'name email');
  res.json(projects);
});

// Get project with tasks
router.get('/:id', authMiddleware, async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members','name email');
  const tasks = await Task.find({ project: project._id }).populate('assignee','name email').sort('order');
  res.json({ project, tasks });
});

// Add member
router.post('/:id/members', authMiddleware, async (req, res) => {
  const { email } = req.body;
  const proj = await Project.findById(req.params.id);
  if (!proj) return res.status(404).json({ message: 'Not found' });
  // simplistic add: find user by email
  const User = require('../models/User');
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  proj.members.push(user._id);
  await proj.save();
  res.json(proj);
  req.app.get('io')?.emit('project:member_added', { projectId: proj._id, user });
});

module.exports = router;
