'use strict';
module.exports = (sequelize, DataTypes) => {
  const DepartmentEmployee = sequelize.define('DepartmentEmployee', {
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Departments',
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      allowNull: false
    }
  }, {});

  return DepartmentEmployee;
};
