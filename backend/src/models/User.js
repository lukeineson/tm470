const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  puppyName: { type: String, required: true },
  completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'trainingModules' }]
});

module.exports = mongoose.model('User', userSchema);
