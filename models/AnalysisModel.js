const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  locationName: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  healthStatus: {
    type: String,
    enum: ["Healthy", "Unhealthy", "Moderate"],
    required: true
  },
  diseases: {
    type: [String],
    default: []
  },
  recommendations: {
    type: [String],
    default: []
  },
  fertilizers: {
    type: [String],
    default: []
  },
  suggestedCrops: {
    type: [String],
    default: []
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  imageUrl: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Analysis", analysisSchema);
