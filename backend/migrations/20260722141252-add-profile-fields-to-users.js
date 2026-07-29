'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'users',
      'Bio',
      {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: "",
      }
    );

    await queryInterface.addColumn(
      'users',
      'University',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );


    await queryInterface.addColumn(
      'users',
      'PhoneNumber',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );


    await queryInterface.addColumn(
      'users',
      'ProfilePicture',
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    );

  },


  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('users', 'Bio');

    await queryInterface.removeColumn('users', 'University');

    await queryInterface.removeColumn('users', 'PhoneNumber');

    await queryInterface.removeColumn('users', 'ProfilePicture');

  }
};