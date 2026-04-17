const { asyncHandler } = require("../utils/AsyncHandler.js")
const { ApiError } = require("../utils/ApiError.js")
const { ApiResponse } = require("../utils/ApiResponse.js")
const Analysis = require("../models/AnalysisModel.js")

// Mock crop detection data - simulates AI model response
const getCropAnalysisData = (filename) => {
  // Simple crop detection based on file name or random for demo
  // In production, integrate with Google Vision API, TensorFlow, or OpenAI Vision
  
  const cropData = {
    wheat: {
      cropType: "Wheat",
      healthStatus: "Healthy",
      diseases: [],
      recommendations: [
        "Continue regular watering schedule",
        "Monitor for pest activity",
        "Apply nitrogen fertilizer in 2 weeks",
        "Harvest in 4-6 weeks"
      ],
      fertilizers: ["NPK 10-26-26", "Potassium Sulfate"],
      suggestedCrops: ["Barley", "Rye"],
      confidence: 92
    },
    rice: {
      cropType: "Rice",
      healthStatus: "Healthy",
      diseases: [],
      recommendations: [
        "Maintain standing water at 5-10 cm depth",
        "Apply potassium fertilizer for grain filling",
        "Monitor for blast disease",
        "Ready for harvest in 3-4 weeks"
      ],
      fertilizers: ["Urea 46% N", "Single Super Phosphate"],
      suggestedCrops: ["Wheat", "Maize"],
      confidence: 88
    },
    bajra: {
      cropType: "Bajra (Pearl Millet)",
      healthStatus: "Healthy",
      diseases: [],
      recommendations: [
        "Maintain soil moisture during grain filling",
        "Apply 50kg/ha NPK at 45 days after sowing",
        "Watch for shoot fly attacks",
        "Harvest when grains are hard"
      ],
      fertilizers: ["NPK 12-32-16", "Zinc Sulfate"],
      suggestedCrops: ["Groundnut", "Pulses"],
      confidence: 85
    },
    maize: {
      cropType: "Maize (Corn)",
      healthStatus: "Healthy",
      diseases: [],
      recommendations: [
        "First irrigation after 21-25 days",
        "Apply nitrogen in two splits",
        "Monitor for borer and cutworm attacks",
        "Harvest at physiological maturity"
      ],
      fertilizers: ["Urea", "DAP", "MOP"],
      suggestedCrops: ["Cotton", "Soybean"],
      confidence: 90
    },
    cotton: {
      cropType: "Cotton",
      healthStatus: "Healthy",
      diseases: [],
      recommendations: [
        "Maintain weed-free field",
        "First irrigation at square formation",
        "Monitor for aphids and jassids",
        "Apply growth regulators for better fruiting"
      ],
      fertilizers: ["NPK 0-0-50", "Sulphur"],
      suggestedCrops: ["Groundnut", "Soybean"],
      confidence: 87
    },
    pulses: {
      cropType: "Pulses (Chickpea)",
      healthStatus: "Healthy",
      diseases: [],
      recommendations: [
        "Avoid waterlogging",
        "Use rhizobium culture for better nodulation",
        "Monitor for pod borer",
        "Harvest when 80% pods turn brown"
      ],
      fertilizers: ["DAP", "Zinc"],
      suggestedCrops: ["Wheat", "Barley"],
      confidence: 84
    }
  }
  
  // Simple detection: check filename or use random
  const name = filename.toLowerCase()
  if (name.includes('wheat')) return cropData.wheat
  if (name.includes('rice')) return cropData.rice
  if (name.includes('bajra')) return cropData.bajra
  if (name.includes('maize') || name.includes('corn')) return cropData.maize
  if (name.includes('cotton')) return cropData.cotton
  if (name.includes('pulse') || name.includes('chick')) return cropData.pulses
  
  // Default: return random crop for demo purposes
  const crops = Object.values(cropData)
  return crops[Math.floor(Math.random() * crops.length)]
}

const analyzeCrop = asyncHandler(async (req, res) => {
  const { location, lat, lng } = req.body
  const userId = req.user._id
  
  if (!req.file) {
    throw new ApiError(400, "Image file is required")
  }
  
  if (!location || !lat || !lng) {
    throw new ApiError(400, "Location and coordinates are required")
  }
  
  // Get crop analysis data (in production, use real AI model like Google Vision or TensorFlow)
  const analysisData = getCropAnalysisData(req.file.filename)
  
  // Save analysis to database
  const analysis = await Analysis.create({
    userId,
    locationName: location,
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
    ...analysisData,
    imageUrl: `/uploads/${req.file.filename}`
  })
  
  return res.status(201).json(
    new ApiResponse(201, analysisData, "Crop analysis completed successfully")
  )
})

module.exports = { analyzeCrop }
