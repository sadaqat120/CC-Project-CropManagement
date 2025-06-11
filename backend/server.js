const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Crop Management
app.use("/CropFarm", require("./routes/cropFarmRoutes")); // New CropFarm routes
app.use("/land-records", require("./routes/landRecordRoutes"));
app.use("/crop-records", require("./routes/cropRecordRoutes"));
app.use("/cost-tracking", require("./routes/costTrackingRoutes"));
app.use("/result-summary", require("./routes/resultSummaryRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
