const mongoose = require('mongoose');

const trainingModuleSchema = new mongoose.Schema({
  title: String,
  category: String,
  difficulty: String,
  imagePath: String
}, { collection: 'trainingModules' });  

module.exports = mongoose.model('TrainingModule', trainingModuleSchema);