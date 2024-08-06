const { User, Department, DepartmentEmployee } = require("../models");
const logger = require("../utils/logger");
const { sendResponse, sendError } = require("../utils/responseHelper");

module.exports = {
  getAllEmployees: async (req, res) => {
    try {
      const data = await User.findAll({
        where: {
          role: "Employee",
        },
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
  }


};
