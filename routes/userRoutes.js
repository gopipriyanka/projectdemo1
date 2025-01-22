const express = require('express');
const { 
  signup, 
  signin, 
  updateSubscription, 
  getUserDetailsByEmail, 
  createSubscription 
} = require('../controllers/userController');
const { signupValidator, signinValidator } = require('../validators/signupValidators');
const { validateRequest } = require('../middlewares/validationMiddleware');
const authenticateUser = require('../middlewares/authenticateUser');

const router = express.Router();

// Signup route
router.post('/signup', signupValidator, validateRequest, signup);

// Signin route
router.post('/signin', signinValidator, validateRequest, signin);

// Fetch user details by email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Call the controller directly with req and res
    await getUserDetailsByEmail(req, res);
  } catch (error) {
    console.error('Error in fetching user details:', error.message);
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
});

// Create a new subscription
router.post('/subscription', authenticateUser, async (req, res) => {
  try {
    const { email, type, startDate, endDate } = req.body;

    if (!email || !type || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields (email, type, startDate, endDate) are required.',
      });
    }

    const subscription = await createSubscription({
      email,
      type,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error in creating subscription:', error.message);
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
});

// Update subscription
router.put('/subscription', authenticateUser, updateSubscription);

// Test route
router.get('/test', (req, res) => {
  console.log('Test route accessed.');
  res.status(200).json({ success: true, message: 'User route is working' });
});

module.exports = router;
