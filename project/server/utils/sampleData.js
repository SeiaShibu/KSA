const User = require('../models/User');
const Complaint = require('../models/Complaint');

const createSampleData = async () => {
  try {
    // Check if sample data already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Sample data already exists');
      return;
    }

    console.log('Creating sample data...');

    // Create sample users
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();

    const technician1 = new User({
      name: 'John Technician',
      email: 'tech1@example.com',
      password: 'password123',
      role: 'technician'
    });
    await technician1.save();

    const technician2 = new User({
      name: 'Sarah Tech',
      email: 'tech2@example.com',
      password: 'password123',
      role: 'technician'
    });
    await technician2.save();

    const customer1 = new User({
      name: 'Alice Customer',
      email: 'customer1@example.com',
      password: 'password123',
      role: 'customer'
    });
    await customer1.save();

    const customer2 = new User({
      name: 'Bob Customer',
      email: 'customer2@example.com',
      password: 'password123',
      role: 'customer'
    });
    await customer2.save();

    // Create sample complaints
    const complaints = [
      {
        title: 'Internet Connection Issues',
        description: 'My internet connection has been very slow for the past week. Pages take forever to load and streaming is impossible.',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        createdBy: customer1._id,
        assignedTo: technician1._id
      },
      {
        title: 'Billing Discrepancy',
        description: 'I was charged twice for my monthly subscription. Please review my account and refund the duplicate charge.',
        category: 'billing',
        priority: 'medium',
        status: 'open',
        createdBy: customer2._id
      },
      {
        title: 'Service Outage in Downtown Area',
        description: 'Complete service outage in the downtown area since yesterday evening. Multiple customers affected.',
        category: 'service',
        priority: 'urgent',
        status: 'resolved',
        createdBy: customer1._id,
        assignedTo: technician2._id,
        resolvedAt: new Date()
      },
      {
        title: 'Request for Service Upgrade',
        description: 'I would like to upgrade my current plan to include premium features. Please contact me to discuss options.',
        category: 'general',
        priority: 'low',
        status: 'open',
        createdBy: customer2._id
      },
      {
        title: 'Mobile App Crashes Frequently',
        description: 'The mobile app crashes every time I try to view my account details. This started after the latest update.',
        category: 'technical',
        priority: 'medium',
        status: 'in-progress',
        createdBy: customer1._id,
        assignedTo: technician1._id
      }
    ];

    for (const complaintData of complaints) {
      const complaint = new Complaint(complaintData);
      await complaint.save();

      // Add some sample notes to resolved complaints
      if (complaint.status === 'resolved') {
        complaint.notes.push({
          content: 'Issue has been identified and resolved. Service restored to all affected areas.',
          addedBy: complaint.assignedTo
        });
        await complaint.save();
      }
    }

    console.log('Sample data created successfully!');
    console.log('Login credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Technician 1: tech1@example.com / password123');
    console.log('Technician 2: tech2@example.com / password123');
    console.log('Customer 1: customer1@example.com / password123');
    console.log('Customer 2: customer2@example.com / password123');

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

module.exports = createSampleData;