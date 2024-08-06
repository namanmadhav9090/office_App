const express = require('express');

const { getAllEmployees, assignEmployeesToDepartment } = require('../controllers/userController');

const router = express.Router();



// Signup route
router.get('/', getAllEmployees);
router.post('/assign', assignEmployeesToDepartment);



module.exports = router;
