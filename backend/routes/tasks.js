const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const { authMiddleware } = require('./auth');

// Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    await task.populate('assignee','name email');
    res.json(task);
    req.app.get('io')?.emit('task:created', task);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignee','name email');
    res.json(task);
    req.app.get('io')?.emit('task:updated', task);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ task: task._id });
    res.json({ success: true });
    req.app.get('io')?.emit('task:deleted', { id: req.params.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Comments
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.create({ task: req.params.id, author: req.user.id, text: req.body.text });
    await comment.populate('author','name email');
    res.json(comment);
    req.app.get('io')?.emit('comment:created', comment);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
