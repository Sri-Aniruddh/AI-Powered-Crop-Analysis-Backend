const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/ErrorHandler"); 
require("dotenv").config();

const app = express();

// CORS
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8080", "http://localhost:3000"],
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/upload", require("./routes/UploadRoute"));
app.use("/api/weather", require("./routes/WeatherAPI"));
app.use("/api/analysis", require("./routes/AnalysisRoute"));

// Test route
app.post("/test", (req, res) => {
    console.log("TEST HIT");
    res.json({ message: "Working fine" });
});

app.use(errorHandler);
// Start server
connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`⚙️ Server running on port ${process.env.PORT || 5000}`);
    });
})
.catch((err) => {
    console.log("MongoDB connection failed:", err);
});