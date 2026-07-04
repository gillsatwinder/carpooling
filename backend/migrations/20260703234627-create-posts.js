"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("posts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM(
          "RIDE_REQUEST",
          "RIDE_OFFER",
          "GENERAL_AD"
        ),
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      pickup_location: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      destination: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      ride_datetime: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      seats: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("OPEN", "CLOSED", "CANCELLED"),
        defaultValue: "OPEN",
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("posts");

    // cleanup ENUM types in Postgres
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_posts_type";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_posts_status";'
    );
  },
};