const mongoose = require('mongoose');

/**
 * @schema TrainingModule
 * @description Schema representing a training module for the puppy training app.
 *              Each module includes basic metadata and a list of training steps.
 */
const trainingModuleSchema = new mongoose.Schema(
  {
    // Title of the training module (e.g., "Sit", "Heel", etc.)
    title: String,

    // Category the module belongs to (e.g., "Basic Obedience", "Lead Walking")
    category: String,

    // Difficulty level (e.g., "Beginner", "Intermediate", "Advanced")
    difficulty: String,

    // Path or URL to an image representing the module
    imagePath: String,

    // Ordered list of training steps/instructions for the module
    trainingSteps: [String],
  },
  {
    // Explicitly define the MongoDB collection name
    collection: 'trainingModules',
  }
);

// Export the Mongoose model for use in the application
module.exports = mongoose.model('TrainingModule', trainingModuleSchema);
