const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path'); // ✅ added
require('dotenv').config();

const User = require('./models/User');
const TrainingModule = require('./models/TrainingModule');
const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse incoming JSON requests

// ✅ Serve images folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

/**
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
 */
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, puppyName, username, password } = req.body;

    if (!firstName || !lastName || !puppyName || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      puppyName,
      username,
      password: hashedPassword,
      completedModules: []
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: savedUser._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /modules
 * @desc    Get all training modules with completion status for the logged-in user
 * @access  Private
 */
app.get('/modules', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const completedModuleIds = new Set(user.completedModules.map(id => id.toString()));
    const allModules = await TrainingModule.find({}).lean();

    const result = allModules.map(mod => ({
      _id: mod._id,
      title: mod.title,
      category: mod.category,
      difficulty: mod.difficulty,
      imagePath: mod.imagePath,
      completed: completedModuleIds.has(mod._id.toString())
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching modules:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /module/:id
 * @desc    Get details of a specific training module by ID, including completion status for logged-in user
 * @access  Private
 */
app.get('/module/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid module ID' });
  }

  try {
    const module = await TrainingModule.findById(id);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const user = await User.findById(req.user.userId);
    const completed = user.completedModules.includes(id);

    res.json({ ...module.toObject(), completed });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /progress/:moduleId
 * @desc    Toggle completion of a module for the current user
 * @access  Private
 */
app.post('/progress/:moduleId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const moduleId = req.params.moduleId;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const index = user.completedModules.indexOf(moduleId);
    if (index === -1) {
      // Not completed yet → mark as completed
      user.completedModules.push(moduleId);
    } else {
      // Already completed → remove it
      user.completedModules.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      message: 'Module completion toggled',
      completedModules: user.completedModules,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /profile
 * @desc    Get user's profile and training progress summary
 * @access  Private
 */
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const allModules = await TrainingModule.find();
    const completedModules = user.completedModules.map(id => id.toString());
    const totalComplete = completedModules.length;

    const categories = {};
    for (const module of allModules) {
      const cat = module.category;
      if (!categories[cat]) categories[cat] = { total: 0, completed: 0 };

      categories[cat].total += 1;
      if (completedModules.includes(module._id.toString())) {
        categories[cat].completed += 1;
      }
    }

    const categoryProgress = {};
    for (const [cat, { total, completed }] of Object.entries(categories)) {
      categoryProgress[cat] = total === 0 ? 0 : Math.round((completed / total) * 100);
    }

    res.status(200).json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      puppyName: user.puppyName,
      totalComplete,
      categoryProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
