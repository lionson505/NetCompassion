// routes/attendance.js

const express = require('express');
const Attendance = require('../models/Attendance');

const router = express.Router();

// POST: Save multiple attendance records
router.post('/', async (req, res) => {
  try {
    const attendanceData = req.body; // Expecting an array of attendance records

    // Validate attendance data (add your own validation logic if needed)
    if (!Array.isArray(attendanceData)) {
      return res.status(400).json({ message: 'Invalid attendance data format' });
    }

    const attendanceRecords = await Attendance.insertMany(attendanceData);
    
    res.status(201).json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save attendance data' });
  }
});

// GET: Retrieve attendance records (optional)
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find().populate('youthId'); // Populate youthId for better data
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve attendance records' });
  }
});

module.exports = router;
