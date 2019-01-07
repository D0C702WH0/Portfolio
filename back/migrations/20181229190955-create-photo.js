"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("photos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      path: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("photos");
  }
};
