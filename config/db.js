const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_DB_URL)
        console.log(`\n MongoDB connected !! DB host: ${connectionInstance.connection.host}`)
        return connectionInstance;
    } catch (error) {
        console.log("MONGODB connection error", error.message);
        process.exit(1)
    }
};

module.exports = connectDB;