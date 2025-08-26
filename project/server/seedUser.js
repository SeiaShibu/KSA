const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/complaint-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seed() {
  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isActive: true
    },
    {
      name: 'Technician User',
      email: 'tech1@example.com',
      password: 'password123',
      role: 'technician',
      isActive: true
    },
    {
      name: 'Customer User',
      email: 'customer1@example.com',
      password: 'password123',
      role: 'customer',
      isActive: true
    }
  ];

  for (let userData of users) {
    const exists = await User.findOne({ email: userData.email });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }

  mongoose.disconnect();
}

seed();
