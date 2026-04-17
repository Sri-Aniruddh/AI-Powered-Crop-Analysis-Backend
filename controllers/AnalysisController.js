const { asyncHandler } = require("../utils/AsyncHandler.js")
const { ApiError } = require("../utils/ApiError.js")
const { ApiResponse } = require("../utils/ApiResponse.js")
const Analysis = require("../models/AnalysisModel.js")

const getAnalysisHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id
  
  const analyses = await Analysis.find({ userId })
    .sort({ createdAt: -1 })
  
  return res.status(200).json(
    new ApiResponse(200, analyses, "Analysis history fetched successfully")
  )
})

const getAnalysisCount = asyncHandler(async (req, res) => {
  const userId = req.user._id
  
  const count = await Analysis.countDocuments({ userId })
  
  return res.status(200).json(
    new ApiResponse(200, count, "Analysis count fetched successfully")
  )
})

const saveAnalysis = asyncHandler(async (req, res) => {
  const { locationName, latitude, longitude, cropType, healthStatus, diseases, recommendations, fertilizers, suggestedCrops, confidence } = req.body
  
  const analysis = await Analysis.create({
    userId: req.user._id,
    locationName,
    latitude,
    longitude,
    cropType,
    healthStatus,
    diseases,
    recommendations,
    fertilizers,
    suggestedCrops,
    confidence
  })
  
  return res.status(201).json(
    new ApiResponse(201, analysis, "Analysis saved successfully")
  )
})

module.exports = { getAnalysisHistory, getAnalysisCount, saveAnalysis }
