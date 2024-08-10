const {Pool} = require('pg');
module.exports = new Pool({
    host: "localhost", // or wherever the dbis hosted
    user: "reubencook",
    database: "members_only",
    password: process.env.DATABASE_PASSWORD,
    port: 5432 // The default port
});