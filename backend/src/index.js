const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const TrainingModule = require('./models/TrainingModule');
const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Register endpoint
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, puppyName, username, password } = req.body;

    if (!firstName || !lastName || !puppyName || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

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

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });

    // User not found
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Password doesn't match
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
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

// Get Modules Endpoint
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

// Get Module By ID Endpoint
app.get('/module/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid module ID' });
  }

  try {
    const module = await TrainingModule.findById(id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update module as complete endpoint
app.post('/progress/:moduleId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const moduleId = req.params.moduleId;

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // If moduleId is already in completedModules, do nothing
    if (!user.completedModules.includes(moduleId)) {
      user.completedModules.push(moduleId);
      await user.save();
    }

    res.status(200).json({
      message: 'Module marked as completed',
      completedModules: user.completedModules,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});


