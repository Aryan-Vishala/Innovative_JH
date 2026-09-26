require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Innovative Jharkhand Server] Running on http://localhost:${PORT}`);
    console.log(`[Innovative Jharkhand Server] Health check: http://localhost:${PORT}/api/v1/health`);
  });
});
