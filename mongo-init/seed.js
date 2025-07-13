db = db.getSiblingDB('puppytraining');

// Create collections
db.createCollection('users');
db.createCollection('trainingModules');

// Insert training modules
db.trainingModules.insertMany([
  {
    title: "Sit Command",
    category: "Basic Obedience",
    difficulty: "Beginner",
    imagePath: "/images/sit.png",
    trainingSteps: [
      "Hold a treat close to your dog's nose.",
      "Move your hand up, allowing their head to follow the treat and causing their bottom to lower.",
      "Once in sitting position, say 'Sit', give the treat, and praise."
    ]
  },
  {
    title: "Stay Command",
    category: "Basic Obedience",
    difficulty: "Intermediate",
    imagePath: "/images/stay.png",
    trainingSteps: [
      "Ask your dog to 'Sit'.",
      "Open your palm in front of you and say 'Stay'.",
      "Take a few steps back. If they stay, reward them.",
      "Gradually increase distance."
    ]
  }
]);
