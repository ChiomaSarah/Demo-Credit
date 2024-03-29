const knexfile = require("./../../knexfile.js");
const dotenv = require("dotenv");
const knex = require("knex");

dotenv.config();
const env: string = process.env.NODE_ENV || "development";
const options: any = knexfile[env];

module.exports = knex(options);
