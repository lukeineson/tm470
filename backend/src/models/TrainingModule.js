// const mongoose = require('mongoose');

// const trainingModuleSchema = new mongoose.Schema({
//   title: String,
//   category: String,
//   difficulty: String,
//   imagePath: String
// }, { collection: 'trainingModules' });  

// module.exports = mongoose.model('TrainingModule', trainingModuleSchema);

const mongoose = require('mongoose');

const trainingModuleSchema = new mongoose.Schema({
  title: String,
  category: String,
  difficulty: String,
  imagePath: String,
  trainingSteps: [String]  // Add this to store steps as an array of strings
}, { collection: 'trainingModules' });

module.exports = mongoose.model('TrainingModule', trainingModuleSchema);
