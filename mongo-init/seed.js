db = db.getSiblingDB('puppytraining');

// Create collections
db.createCollection('users');
db.createCollection('trainingModules');

db.trainingModules.insertMany([
  {
    title: "Sit",
    category: "Basic Obedience",
    difficulty: "Easy",
    imagePath: "/images/puppy_sitting_down.png",
    trainingSteps: [
      "Hold a treat close to your puppy’s nose.",
      "Move your hand up so their head follows and bottom lowers.",
      "As soon as they sit, say “Sit” and give the treat.",
      "Repeat several times in short sessions."
    ]
  },
  {
    title: "Stay",
    category: "Basic Obedience",
    difficulty: "Medium",
    imagePath: "/images/puppy_staying_still_with_hand_signal.png",
    trainingSteps: [
      "Ask your puppy to sit.",
      "Open your palm in front and say “Stay”.",
      "Take a step back, then return and reward.",
      "Gradually increase distance and time."
    ]
  },
  {
    title: "Come When Called",
    category: "Basic Obedience",
    difficulty: "Medium",
    imagePath: "/images/puppy_running_towards_owner.png",
    trainingSteps: [
      "Squat down and say “Come” excitedly.",
      "Reward immediately when your puppy runs to you.",
      "Practice indoors first, then outdoors."
    ]
  },
  {
    title: "Toilet Training",
    category: "Toilet Training",
    difficulty: "Hard",
    imagePath: "/images/puppy_outside_squatting.png",
    trainingSteps: [
      "Take puppy out every 1-2 hours and after meals/sleep.",
      "Go to the same spot and use a cue like “Go Potty”.",
      "Praise and reward immediately after they go.",
      "Never punish for accidents."
    ]
  },
  {
    title: "Crate Training",
    category: "Toilet Training",
    difficulty: "Medium",
    imagePath: "/images/puppy_in_cozy_crate.png",
    trainingSteps: [
      "Make crate inviting with soft bedding.",
      "Feed meals inside the crate.",
      "Leave the door open initially.",
      "Gradually increase the time spent inside with the door closed."
    ]
  },
  {
    title: "Meeting Other Dogs",
    category: "Socialisation",
    difficulty: "Medium",
    imagePath: "/images/puppies_sniff_each_other.png",
    trainingSteps: [
      "Choose calm, friendly dogs to introduce your puppy to.",
      "Keep both on a leash at first.",
      "Allow sniffing for a few seconds, then walk away.",
      "Reward for calm behaviour."
    ]
  },
  {
    title: "Meeting People",
    category: "Socialisation",
    difficulty: "Easy",
    imagePath: "/images/puppy_being_petted_by_kids.png",
    trainingSteps: [
      "Expose your puppy to different types of people (Adults, Children).",
      "Allow puppy to approach at their own pace.",
      "Use treats to create positive associations."
    ]
  },
  {
    title: "Walking on a Lead",
    category: "Lead Walking",
    difficulty: "Medium",
    imagePath: "/images/puppy_on_lead_with_owner.png",
    trainingSteps: [
      "Introduce the collar/harness indoors.",
      "Attach the lead and let them explore.",
      "Walk short distances and then reward for staying close.",
      "Stop walking when they pull and only continue when they have stopped pulling."
    ]
  },
  {
    title: "Loose-lead Walking",
    category: "Lead Walking",
    difficulty: "Hard",
    imagePath: "/images/owner_and_puppy_walking_side_by_side.png",
    trainingSteps: [
      "Reward your puppy for walking beside you.",
      "Use a cue like “Lets go”.",
      "Change direction if they pull.",
      "Practice often in low-distraction areas.",
      "Gradually start adding in more distractions."
    ]
  },
  {
    title: "Leave It",
    category: "Impulse Control",
    difficulty: "Medium",
    imagePath: "/images/puppy_ignoring_treat_on_floor.png",
    trainingSteps: [
      "Hold a treat in a closed fist.",
      "Let your puppy sniff the treat but do not give it.",
      "When they back off, say “Leave It” and reward from other hand."
    ]
  },
  {
    title: "Wait at Door",
    category: "Impulse Control",
    difficulty: "Hard",
    imagePath: "/images/puppy_sitting_at_doorway.png",
    trainingSteps: [
      "Ask puppy to “Sit” at the door.",
      "Begin to open it slightly.",
      "If the puppy moves, close the door.",
      "Repeat until they wait calmly."
    ]
  },
  {
    title: "Take It / Drop It",
    category: "Impulse Control",
    difficulty: "Medium",
    imagePath: "/images/puppy_holding_toy_in_mouth.png",
    trainingSteps: [
      "Offer a toy and say, “Take it”.",
      "After a moment, offer treat and say, “Drop it”.",
      "Reward when they release the toy.",
      "Repeat and build consistency."
    ]
  },
  {
    title: "Shake Paw",
    category: "Enrichment & Tricks",
    difficulty: "Easy",
    imagePath: "/images/puppy_offering_paw.png",
    trainingSteps: [
      "Ask puppy to sit.",
      "Gently lift a paw and say “Shake”.",
      "Reward and repeat.",
      "Gradually wait for puppy to offer paw."
    ]
  },
  {
    title: "Find It",
    category: "Enrichment & Tricks",
    difficulty: "Easy",
    imagePath: "/images/puppy_sniffing_under_towel.png",
    trainingSteps: [
      "Show your puppy a treat.",
      "Hide it under a towel or in a room.",
      "Say “Find It” and encourage them to sniff it out."
    ]
  },
  {
    title: "Vet Visit Preparation",
    category: "Socialisation",
    difficulty: "Medium",
    imagePath: "/images/puppy_examined_by_vet.png",
    trainingSteps: [
      "Touch puppies’ ears, paws and mouth daily.",
      "Reward calm behaviour.",
      "Use treats and praise at the vets."
    ]
  }
]);
