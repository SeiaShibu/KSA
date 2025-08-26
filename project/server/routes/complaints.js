const express = require('express');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/complaints
// @desc    Create new complaint
// @access  Private (Customer)
router.post('/', auth, authorize('customer'), async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const complaint = new Complaint({
      title,
      description,
      category: category || 'general',
      priority: priority || 'medium',
      createdBy: req.user._id
    });

    await complaint.save();
    await complaint.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/complaints
// @desc    Get complaints based on user role
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    let query = {};

    // Role-based filtering
    if (req.user.role === 'customer') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'technician') {
      query.assignedTo = req.user._id;
    }
    // Admin can see all complaints (no additional filtering)

    // Status and priority filters
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check access permissions
    if (req.user.role === 'customer' && complaint.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'technician' && complaint.assignedTo?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ complaint });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/complaints/:id/assign
// @desc    Assign complaint to technician
// @access  Private (Admin only)
router.put('/:id/assign', auth, authorize('admin'), async (req, res) => {
  try {
    const { technicianId } = req.body;

    // Verify technician exists
    const technician = await User.findOne({ 
      _id: technicianId, 
      role: 'technician', 
      isActive: true 
    });
    
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found or inactive' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: technicianId,
        status: 'in-progress'
      },
      { new: true }
    ).populate('createdBy assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({
      message: 'Complaint assigned successfully',
      complaint
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status
// @access  Private (Technician and Admin)
router.put('/:id/status', auth, authorize('technician', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Technicians can only update their assigned complaints
    if (req.user.role === 'technician' && complaint.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    complaint.status = status;
    if (status === 'resolved' || status === 'closed') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();
    await complaint.populate('createdBy assignedTo', 'name email');

    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/complaints/:id/notes
// @desc    Add note to complaint
// @access  Private (Technician and Admin)
router.post('/:id/notes', auth, authorize('technician', 'admin'), async (req, res) => {
  try {
    const { content } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Technicians can only add notes to their assigned complaints
    if (req.user.role === 'technician' && complaint.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    complaint.notes.push({
      content,
      addedBy: req.user._id
    });

    await complaint.save();
    await complaint.populate('notes.addedBy', 'name email');

    res.json({
      message: 'Note added successfully',
      note: complaint.notes[complaint.notes.length - 1]
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/complaints/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (Admin only)
router.get('/analytics/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: 'open' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in-progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    
    // Complaints by category
    const complaintsByCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Complaints by priority
    const complaintsByPriority = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly complaints trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      overview: {
        totalComplaints,
        openComplaints,
        inProgressComplaints,
        resolvedComplaints
      },
      complaintsByCategory,
      complaintsByPriority,
      monthlyTrend
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;