const { User, Department, DepartmentEmployee } = require("../models");
const logger = require("../utils/logger");
const { sendResponse, sendError } = require("../utils/responseHelper");
const { Op } = require('sequelize');

module.exports = {
  getAllEmployees: async (req, res) => {
    try {
      const employeeId = req.query.id;
      console.log("employeeId",employeeId);

      if(employeeId){
        console.log('in if');
        const employee = await User.findOne({
          where: {
            id: employeeId,
            role: "Employee",
          },
          include: [{
            model: Department,
            through: {
              attributes: [] // Exclude attributes from the join table
            }
          }]
        });
    
        if (!employee) {
          return sendResponse(res, 404, null, "Employee not found");
        }
    
        return sendResponse(res, 200, employee, "Employee details fetched successfully");
      }
      const data = await User.findAll({
        where: {
          role: "Employee",
        },
        include: [{
          model: Department,
          through: {
            attributes: [] // Exclude attributes from the join table
          }
        }]
      });

      if (data?.length == 0) {
        return sendResponse(res, 404, data, "No data found");
      }

      return sendResponse(res, 200, data, "All Employees fetched successfully");
    } catch (error) {
      console.log("err", error);
      logger.error("Error during signup: ", error.message);
      return sendError(res, 500, "Server error");
    }
  },

  assignEmployeesToDepartment: async (req, res) => {
    try {
      const departmentId = parseInt(req.query.departmentId, 10);
      const { employeeIds } = req.body; // Expecting an array of employee IDs

      if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
        return sendError(res, 400, 'No employee IDs provided.');
      }

      // Validate department
      const department = await Department.findByPk(departmentId);
      if (!department) {
        return sendError(res, 404, 'Department not found.');
      }

      // Validate employees
      const employees = await User.findAll({
        where: {
          id: employeeIds,
          role: 'Employee'
        }
      });

      console.log('employeess',employees);

      const validEmployeeIds = employees.map(emp => emp.id);
      const invalidEmployeeIds = employeeIds.filter(id => !validEmployeeIds.includes(id));

      if (invalidEmployeeIds.length > 0) {
        return sendError(res, 400, `Invalid employee IDs: ${invalidEmployeeIds.join(', ')}`);
      }

      // Assign employees to department
      await DepartmentEmployee.destroy({
        where: { departmentId }
      }); // Optional: Clear existing assignments if required

      const departmentEmployeeEntries = employeeIds.map(employeeId => ({
        departmentId,
        employeeId
      }));

      console.log('departmentEmployeeEntries',departmentEmployeeEntries);

      await DepartmentEmployee.bulkCreate(departmentEmployeeEntries);

      return sendResponse(res, 200, null, 'Employees assigned to department successfully.');
    } catch (error) {
      console.error('Error assigning employees to department:', error);
      logger.error('Error during assigning employees: ', error.message);
      return sendError(res, 500, 'Server error');
    }
  },

  getITEmployeesInLocationA : async (req, res) => {
    try {
      const employees = await User.findAll({
        include: [{
          model: Department,
          where: {
            categoryName: 'IT',
            location: {
              [Op.startsWith]: 'A' // This uses Sequelize's Op (Operators) to match locations starting with 'A'
            }
          },
          through: {
            attributes: [] // Exclude attributes from the join table
          }
        }]
      });
  
      if (employees.length === 0) {
        return sendResponse(res, 404, [], "No IT employees found in locations starting with 'A'");
      }
  
      return sendResponse(res, 200, employees, "IT employees in locations starting with 'A' fetched successfully");
    } catch (error) {
      console.error("Error fetching IT employees in location A:", error);
      return sendError(res, 500, "Server error");
    }
  },

  getSalesEmployeesSortedByName : async (req, res) => {
    try {
      const employees = await User.findAll({
        include: [{
          model: Department,
          where: {
            categoryName: 'Sales'
          },
          through: {
            attributes: [] // Exclude attributes from the join table
          }
        }],
        order: [['firstName', 'DESC']] // Sort by firstName in descending order
      });
  
      if (employees.length === 0) {
        return sendResponse(res, 404, [], "No Sales employees found");
      }
  
      return sendResponse(res, 200, employees, "Sales employees sorted by name in descending order fetched successfully");
    } catch (error) {
      console.error("Error fetching Sales employees sorted by name:", error);
      return sendError(res, 500, "Server error");
    }
  }




};
