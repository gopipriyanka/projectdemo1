const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectControllers');
const authenticateUser = require('../middlewares/authenticateUser');
const mongoose = require('mongoose');
 
const router = express.Router();
 
// Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid project ID format.' });
  }
  next();
};
 
// Route to create a new project
router.post('/projects', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?._id; // Assuming `authenticateUser` attaches user info
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing or invalid.' });
    }
 
    // Call the controller to create the project
    await createProject(req, res);
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});
 
// Route to get all projects of the authenticated user
router.get('/projects', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?._id; // Assuming `authenticateUser` attaches user info
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing or invalid.' });
    }
 
    // Call the controller to get projects
    await getProjects(req, res);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});
 
// Route to get a single project by ID
router.get('/:id', authenticateUser, validateObjectId, async (req, res) => {
  try {
    await getProjectById(req, res);
  } catch (error) {
    console.error('Error fetching project by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch project.' });
  }
});
 
// Route to update a project by ID
router.put('/:id', authenticateUser, validateObjectId, async (req, res) => {
  try {
    await updateProject(req, res);
  } catch (error) {
    console.error('Error updating project:', error.message);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});
 
// Route to delete a project by ID
router.delete('/:id', authenticateUser, validateObjectId, async (req, res) => {
  try {
    await deleteProject(req, res);
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});
 
module.exports = router;