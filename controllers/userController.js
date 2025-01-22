const {
  registerUser,
  authenticateUser,
  fetchUserDetailsByEmail,
  updateSubscription,
  createSubscription,
} = require('../services/userServices'); // Import services for user and subscription logic

const Subscription = require('../models/subscriptionModel'); // Import Subscription model
const User = require('../models/userModel');

// Signup Controller
exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, password, mobile, country, state, companyName, designation } = req.body;

    // Validate input
    if (!fullName || !email || !password || !mobile || !country || !state || !companyName || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Email, Password, Mobile, Country, State, Company Name, and Designation are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const user = await registerUser({ fullName, email, password, mobile, country, state, companyName, designation });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: user,
    });
  } catch (error) {
    console.error('Error in signup:', error.message);
    next(error);
  }
};

// Signin Controller
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and Password are required.',
      });
    }

    const result = await authenticateUser(email, password);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User signed in successfully.',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    console.error('Error in signin:', error.message);
    next(error);
  }
};

// Update Subscription Controller
exports.updateSubscription = async (req, res, next) => {
  try {
    const { userId, subscriptionType, durationInDays } = req.body;

    if (!userId || !subscriptionType || !durationInDays) {
      return res.status(400).json({
        success: false,
        message: 'userId, subscriptionType, and durationInDays are required.',
      });
    }

    if (typeof durationInDays !== 'number' || durationInDays <= 0) {
      return res.status(400).json({
        success: false,
        message: 'durationInDays must be a positive number.',
      });
    }

    const validSubscriptionTypes = ['FreeTrail', 'Organization'];
    if (!validSubscriptionTypes.includes(subscriptionType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid subscription type. Valid types are: ${validSubscriptionTypes.join(', ')}.`,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000);

    const subscription = await createSubscription({
      userId,
      type: subscriptionType,
      startDate,
      endDate,
      status: 'active',
    });

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully.',
      data: subscription,
    });
  } catch (error) {
    console.error('Error in updateSubscription:', error.message);
    next(error);
  }
};

// Get User Details by Email Controller
exports.getUserDetailsByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    const user = await fetchUserDetailsByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const subscription = await Subscription.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'User details retrieved successfully.',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        subscription: subscription || null,
      },
    });
  } catch (error) {
    console.error('Error in getUserDetailsByEmail:', error.message);
    next(error);
  }
};
