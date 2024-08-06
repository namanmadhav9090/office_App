'use strict';
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryName: {
      type: DataTypes.ENUM('HR', 'IT', 'Sales', 'Product', 'Marketing'),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Department.associate = function(models) {
    // Department belongs to many Users through DepartmentEmployees
    Department.belongsToMany(models.User, {
      through: 'DepartmentEmployee',
      foreignKey: 'departmentId'
    });

    
  };

  return Department;
};
