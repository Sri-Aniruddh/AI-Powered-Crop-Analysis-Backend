const express = require("express");
const router = express.Router();
const upload = require("../middleware/Uploads");
const { analyzeCrop } = require("../controllers/CropAnalysisController.js");
const { verifyJWT } = require("../middleware/Auth.js");

router.post("/", upload.single("image"), (req, res) => {
  res.json({
    message: "Image uploaded",
    file: req.file.filename
  });
});

router.post("/analyze", verifyJWT, upload.single("image"), analyzeCrop);

module.exports = router;