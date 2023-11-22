"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TransactionHistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ProductId: {
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      total_price: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("TransactionHistories", {
      fields: ["ProductId"],
      type: "foreign key",
      name: "product_fk_transaction_history",
      references: {
        table: "Products",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("TransactionHistories", {
      fields: ["UserId"],
      type: "foreign key",
      name: "user_fk_transaction_history",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "TransactionHistories",
      "product_fk_transaction_history"
    );
    await queryInterface.removeConstraint(
      "TransactionHistories",
      "user_fk_transaction_history"
    );
    await queryInterface.dropTable("TransactionHistories");
  },
};
