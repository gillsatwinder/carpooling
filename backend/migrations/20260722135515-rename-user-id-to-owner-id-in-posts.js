"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "posts",
      "user_id",
      "owner_id"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      "posts",
      "owner_id",
      "user_id"
    );
  },
};