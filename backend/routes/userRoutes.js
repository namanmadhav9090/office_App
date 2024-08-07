const express = require('express');

const { getAllEmployees, assignEmployeesToDepartment, getITEmployeesInLocationA, getSalesEmployeesSortedByName } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();



// Signup route
router.get('/', authenticate,getAllEmployees);
router.post('/assign',authenticate,assignEmployeesToDepartment);
router.get('/itemp', authenticate,getITEmployeesInLocationA);
router.get('/salesemp', authenticate,getSalesEmployeesSortedByName);



module.exports = router;
