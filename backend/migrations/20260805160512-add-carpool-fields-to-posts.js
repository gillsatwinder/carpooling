'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      "posts",
      "allow_carpool",
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    );


    await queryInterface.addColumn(
      "posts",
      "converted_offer_id",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );

  },


  async down(queryInterface) {

    await queryInterface.removeColumn(
      "posts",
      "allow_carpool"
    );

    await queryInterface.removeColumn(
      "posts",
      "converted_offer_id"
    );

  }
};