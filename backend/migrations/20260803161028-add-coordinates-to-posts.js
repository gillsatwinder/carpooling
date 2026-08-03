"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      "posts",
      "pickup_lat",
      {
        type: Sequelize.DECIMAL(10,8),
        allowNull: true,
      }
    );


    await queryInterface.addColumn(
      "posts",
      "pickup_lng",
      {
        type: Sequelize.DECIMAL(11,8),
        allowNull: true,
      }
    );


    await queryInterface.addColumn(
      "posts",
      "destination_lat",
      {
        type: Sequelize.DECIMAL(10,8),
        allowNull: true,
      }
    );


    await queryInterface.addColumn(
      "posts",
      "destination_lng",
      {
        type: Sequelize.DECIMAL(11,8),
        allowNull: true,
      }
    );

  },


  async down(queryInterface) {

    await queryInterface.removeColumn(
      "posts",
      "pickup_lat"
    );


    await queryInterface.removeColumn(
      "posts",
      "pickup_lng"
    );


    await queryInterface.removeColumn(
      "posts",
      "destination_lat"
    );


    await queryInterface.removeColumn(
      "posts",
      "destination_lng"
    );

  }
};