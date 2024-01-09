/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tokens", (table) => {
    table.increments("id").primary(); // Auto-incrementing primary key
    table.integer("user_id").unsigned().references("id").inTable("users"); // Foreign key to users table
    table.string("token").notNullable();
    // Add other fields as needed

    table.timestamp("created_at").defaultTo(knex.fn.now()); // Optional: Timestamp for token creation
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tokens");
};
