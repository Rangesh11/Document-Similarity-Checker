const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const compareRoutes = require('./routes/compareRoutes');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoute');
const historyRoutes = require('./routes/historyRoutes'); 

dotenv.config();

const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/documents', compareRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api', historyRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
