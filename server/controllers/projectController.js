const Project = require('../models/Project');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId })
      .populate('clientId', 'name email company')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  const { clientId, title, description, status, deadline, totalAmount, paidAmount } = req.body;
  if (!clientId || !title)
    return res.status(400).json({ message: 'Client and title are required' });

  try {
    const project = await Project.create({
      userId: req.userId,
      clientId,
      title,
      description,
      status,
      deadline,
      totalAmount,
      paidAmount,
    });
    const populated = await project.populate('clientId', 'name email company');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const fields = ['title', 'description', 'status', 'deadline', 'totalAmount', 'paidAmount', 'clientId'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) project[f] = req.body[f];
    });

    await project.save();
    const populated = await project.populate('clientId', 'name email company');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };