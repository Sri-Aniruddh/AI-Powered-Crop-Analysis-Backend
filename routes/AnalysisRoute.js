const express = require("express")
const { getAnalysisHistory, getAnalysisCount, saveAnalysis } = require("../controllers/AnalysisController.js")
const { verifyJWT } = require("../middleware/Auth.js")

const router = express.Router()

// Protected routes - require authentication
router.get("/history", verifyJWT, getAnalysisHistory)
router.get("/count", verifyJWT, getAnalysisCount)
router.post("/save", verifyJWT, saveAnalysis)

module.exports = router
