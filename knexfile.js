const dotenv = require("dotenv");

dotenv.config();
module.exports = {
  development: {
    client: "mysql",
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./src/database/db-migration",
    },
  },

  production: {
    client: "mysql",
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./src/database/db-migration",
    },
  },
};
