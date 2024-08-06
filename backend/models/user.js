'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: false
    },
    hobbies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Employee', 'Manager'),
      allowNull: false
    }
  }, {});

  User.associate = function(models) {
    // User belongs to many Departments through DepartmentEmployees
    User.belongsToMany(models.Department, {
      through: 'DepartmentEmployee',
      foreignKey: 'employeeId'
    });
  };

  return User;
};
