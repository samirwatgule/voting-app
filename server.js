const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const userRoutes = require('./routes/userRoutes');
const electorRoutes = require('./routes/electorRoutes');
const voteRoutes = require('./routes/voteRoutes');

const User = require('./models/User');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes mapping
app.use('/api/users', userRoutes);
app.use('/api/electors', electorRoutes);
app.use('/api/votes', voteRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voting_app';

// Seed Admin User
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ aadharCardNumber: 'Admin' });
    if (!adminExists) {
      await User.create({
        aadharCardNumber: 'Admin',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('Default Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  }
};

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connection established successfully');
    seedAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('MongoDB connection error:', err));
