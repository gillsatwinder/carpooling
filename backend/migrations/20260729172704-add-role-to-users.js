'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'users',
      'role',
      {
        type: Sequelize.ENUM('DRIVER', 'PASSENGER', 'BOTH'),
        allowNull: true,
        defaultValue: 'PASSENGER',
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('users', 'role');

    // ENUM types are separate Postgres objects and are NOT dropped by removeColumn.
    // Must drop explicitly or re-running `up` later will fail with
    // "type already exists".
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');

  }
};