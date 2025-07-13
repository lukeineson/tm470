const mongoose = require('mongoose');

/**
 * @schema User
 * @description Represents a user in the puppy training app, including personal details,
 *              login credentials, and module completion tracking.
 */
const userSchema = new mongoose.Schema({
  // Unique username used for login and identification
  username: { type: String, required: true, unique: true },

  // Hashed password for secure authentication
  password: { type: String, required: true },

  // User's first name
  firstName: { type: String, required: true },

  // User's last name
  lastName: { type: String, required: true },

  // Name of the user's puppy
  puppyName: { type: String, required: true },

  // Array of module IDs the user has completed, referencing the trainingModules collection
  completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'trainingModules' }]
});

// Export the Mongoose model for use in the application
module.exports = mongoose.model('User', userSchema);
