/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("accounts", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.decimal("balance", 10, 2).notNullable().defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Foreign key referencing the 'id' column in the 'users' table
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("firstname"); // firstname column in the accounts table
    table.string("lastname"); // lastname column in the accounts table
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
