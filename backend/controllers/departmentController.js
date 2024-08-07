const Joi = require("joi");
const { Department, DepartmentEmployee, User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const { sendResponse, sendError } = require("../utils/responseHelper");
const Jwt = require("jsonwebtoken");

module.exports = {
  createDepartment: async (req, res) => {
    try {
      const { departmentName, categoryName, location, salary } = req.body;

      const schema = Joi.object({
        departmentName: Joi.string().required(),
        categoryName: Joi.string().required(),
        location: Joi.string().required(),
        salary: Joi.number().required(),
        managerId: Joi.number().required(),
      });

      const { error } = schema.validate(req.body);

      if (error) {
        return sendError(res, 400, error.details[0].message);
      }

      const department = await Department.findOne({
        where: { departmentName },
      });

      if (department) {
        return sendError(res, 400, "Department already exist");
      }

      const data = await Department.create(req.body);

      return sendResponse(res, 201, data, "Department created successfully");
    } catch (error) {
      console.log("err", error);
      logger.error("Error during signup: ", error.message);
      return sendError(res, 500, "Server error");
    }
  },

  getDepartment: async (req, res) => {
    try {
      const { departmentId } = req.query;
      const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit, 10) || 5; // Default to limit 10 if not provided
      const offset = (page - 1) * limit; // Calculate the offset

      

      if (departmentId) {
        const data = await Department.findOne({
          where: {
            id: departmentId,
          },
        });

        console.log('data',data);

        if (!data) {
          return sendResponse(res, 404, data, "No data Found");
        }

        return sendResponse(res, 200, data, "Department details successfully");
      }

      const { count, rows } = await Department.findAndCountAll({
        limit, // Number of items per page
        offset, // Number of items to skip
        include: [{ model: User, through: { attributes: [] } }]
      });

      const totalCount = await Department.count();

      if (rows.length === 0) {
        return sendResponse(res, 404, rows, "No data found");
      }

      console.log('count',totalCount);



      // Calculate total pages
      // const totalPages = Math.ceil(totalCount / limit);

      console.log('czczcc',{ totalItems: count,
        // totalPages,
        currentPage: page,
        pageSize: limit,})
      return sendResponse(
        res,
        200,
        {
          data: rows,
          totalItems : totalCount
          // pagination: {
          //   totalItems: count,
          //   totalPages,
          //   currentPage: page,
          //   pageSize: limit,
          // },
        },
        "All Departments list"
      );
    } catch (error) {
      console.log("err", error);
      logger.error("Error during signup: ", error.message);
      return sendError(res, 500, "Server error");
    }
  },

  updateDepartment : async (req, res) => {
    try {
      const departmentId = parseInt(req.query.departmentId, 10);
      const { departmentName, categoryName, location, salary, employeeIds } = req.body;
  
      // Validation schema
      const schema = Joi.object({
        departmentName: Joi.string().optional(),
        categoryName: Joi.string().valid('HR', 'IT', 'Sales', 'Product', 'Marketing').optional(),
        location: Joi.string().optional(),
        salary: Joi.number().optional(),
        employeeIds: Joi.array().items(Joi.number()).optional(),
      });
  
      const { error } = schema.validate(req.body);
      if (error) {
        return sendError(res, 400, error.details[0].message);
      }
  
      // Check if department exists
      const department = await Department.findByPk(departmentId);
      if (!department) {
        return sendError(res, 404, "Department not found");
      }
  
      // Update department details
      await Department.update(
        { departmentName, categoryName, location, salary },
        { where: { id: departmentId } }
      );
  
      // Update employee assignments if provided
      if (employeeIds) {
        // Validate employee IDs
        const employees = await User.findAll({
          where: {
            id: employeeIds,
            role: 'Employee'
          }
        });
  
        const validEmployeeIds = employees.map(emp => emp.id);
        const invalidEmployeeIds = employeeIds.filter(id => !validEmployeeIds.includes(id));
  
        if (invalidEmployeeIds.length > 0) {
          return sendError(res, 400, `Invalid employee IDs: ${invalidEmployeeIds.join(', ')}`);
        }
  
        // Update assignments
        await DepartmentEmployee.destroy({
          where: { departmentId }
        }); // Optional: Clear existing assignments if required
  
        const departmentEmployeeEntries = validEmployeeIds.map(employeeId => ({
          departmentId,
          employeeId
        }));
  
        await DepartmentEmployee.bulkCreate(departmentEmployeeEntries);
      }
  
      // Fetch updated department with its employees
      const updatedDepartment = await Department.findOne({
        where: { id: departmentId },
        include: [{
          model: User,
          through: { attributes: [] } // Exclude attributes from the join table
        }]
      });
  
      return sendResponse(res, 200, updatedDepartment, "Department updated successfully");
    } catch (error) {
      console.error("Error updating department:", error);
      logger.error("Error during department update: ", error.message);
      return sendError(res, 500, "Server error");
    }
    
    // try {
    //   const departmentId = parseInt(req.query.departmentId, 10);
   
    //   const { departmentName, categoryName, location, salary, employeeIds } = req.body;
  
    //   // Validation schema
    //   const schema = Joi.object({
    //     departmentName: Joi.string().optional(),
    //     categoryName: Joi.string().optional(),
    //     location: Joi.string().optional(),
    //     salary: Joi.number().optional(),
    //     employeeIds: Joi.array().items(Joi.number()).optional(),
    //   });
  
    //   const { error } = schema.validate(req.body);
  
    //   if (error) {
    //     return sendError(res, 400, error.details[0].message);
    //   }
  
    //   // Check if department exists
    //   const department = await Department.findOne({
    //     where: { id: departmentId },
    //   });
  
    //   if (!department) {
    //     return sendError(res, 304, "Department not found");
    //   }
  
    //   // Update department details
    //  const upt = await Department.update(
    //     { departmentName, categoryName, location, salary },
    //     { where: { id: departmentId } }
    //   );
  
    //   // Update employee assignments if provided
    //   if (employeeIds) {
      
    //     const currentEmployees = await DepartmentEmployee.findAll({
    //       where: { departmentId },
    //     });
  
    //     // Extract current employee IDs
    //     const currentEmployeeIds = currentEmployees?.map(e => e.employeeId);
  
    //     // Determine employees to add and remove
    //     const employeesToAdd = employeeIds.filter(id => !currentEmployeeIds.includes(id));
    //     const employeesToRemove = currentEmployeeIds.filter(id => !employeeIds.includes(id));
  
    //     // Add new employees
    //     for (const employeeId of employeesToAdd) {
    //       await DepartmentEmployee.create({ departmentId, employeeId });
    //     }
  
    //     // Remove employees
    //     for (const employeeId of employeesToRemove) {
    //       await DepartmentEmployee.destroy({
    //         where: { departmentId, employeeId },
    //       });
    //     }
    //   }
  
    //   const updatedDepartment = await Department.findOne({
    //     where: { id: departmentId },
    //   });
  
    //   return sendResponse(res, 200, updatedDepartment, "Department updated successfully");
    // } catch (error) {
    //   console.error("Error updating department:", error);
    //   logger.error("Error during department update: ", error.message);
    //   return sendError(res, 500, "Server error");
    // }
  },

  deleteDepartment : async (req, res) => {
    try {
      const departmentId = parseInt(req.query.departmentId, 10);
  
      if (isNaN(departmentId) || departmentId <= 0) {
        return sendError(res, 400, "Invalid department ID");
      }
  
      // Check if the department exists
      const department = await Department.findOne({
        where: { id: departmentId },
      });
  
      if (!department) {
        return sendError(res, 404, "Department not found");
      }
  
      // Delete employee assignments associated with the department
      await DepartmentEmployee.destroy({
        where: { departmentId },
      });
  
      // Delete the department
      await Department.destroy({
        where: { id: departmentId },
      });
  
      return sendResponse(res, 200, null, "Department deleted successfully");
    } catch (error) {
      console.error("Error deleting department:", error);
      logger.error("Error during department deletion: ", error.message);
      return sendError(res, 500, "Server error");
    }
  
  }
  
};
