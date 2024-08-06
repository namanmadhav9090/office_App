'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DepartmentEmployees', {
      departmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Departments',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      employeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DepartmentEmployees');
  }
};
