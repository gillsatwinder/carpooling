const express = require('express');
const db = require('./models');
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));

// Middleware
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true,limit: "10mb"}));
  


// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/posts.routes');
const notificationRoutes = require("./routes/notification.routes");


const participantRoutes= require('./routes/ride_participant.routes')


// Routes
app.use('/auth', authRoutes);
app.use('/user',userRoutes);
app.use('/posts', postRoutes);
app.use('/notifications', notificationRoutes);

//app.use('/api/universities' , universtityRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use('/participants', participantRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;
async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;