"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ride_participants", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      role: {
        type: Sequelize.ENUM("PASSENGER", "DRIVER"),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "ACCEPTED",
          "REJECTED",
          "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
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

    // Prevent duplicate participation in the same post
    await queryInterface.addConstraint("ride_participants", {
      fields: ["post_id", "user_id"],
      type: "unique",
      name: "unique_post_user_participant",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "ride_participants",
      "unique_post_user_participant"
    );

    await queryInterface.dropTable("ride_participants");
  },
};