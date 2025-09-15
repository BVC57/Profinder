require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const searchVerifiedAdminsRoutes = require('./routes/searchVerifiedAdmins');
const notificationRoutes = require('./routes/notificationRoutes');
const userRequestRoutes = require('./routes/userRequestRoutes');
const activityRoutes = require('./routes/activityRoutes');
const contactRoutes = require('./routes/contactRoutes');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.31.3:3000", "http://192.168.31.3:5000"],
    methods: ["GET", "POST"]
  }
});

// Make io available globally
global.io = io;

app.use(cors({
  origin: ["http://localhost:3000", "http://192.168.31.3:3000", "http://192.168.31.3:5000"],
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Join superadmin room for notifications
  socket.on('join-superadmin', () => {
    socket.join('superadmin');
    console.log('User joined superadmin room');
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', searchVerifiedAdminsRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/user-requests', userRequestRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/contact', contactRoutes);

// Global error handler for multer errors
app.use((error, req, res, next) => {
  if (error && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      message: 'File too large. Maximum file size is 10MB.',
      error: 'FILE_TOO_LARGE'
    });
  }
  if (error && error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ 
      message: 'Too many files uploaded.',
      error: 'TOO_MANY_FILES'
    });
  }
  if (error && error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ 
      message: 'Unexpected file field.',
      error: 'UNEXPECTED_FILE'
    });
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = config.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT} and accessible at http://192.168.31.3:${PORT}`));