const express = require('express');

const { createDepartment, getDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');

const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');



// Signup route
router.post('/create', authenticate, createDepartment);
router.get('/', authenticate, getDepartment);
router.put('/update', authenticate, updateDepartment);
router.delete('/delete', authenticate, deleteDepartment);



module.exports = router;