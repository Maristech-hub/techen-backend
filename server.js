const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');

dotenv.config();
const app = express();

// ✅ CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",  // for local dev
    "https://techen.vercel.app/",
    "https://techen-services.vercel.app"  // your Vercel frontend
  ],
  credentials: true
}));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/requests', serviceRequestRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
