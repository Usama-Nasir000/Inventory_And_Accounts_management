const { Pool } = require('pg');
require('dotenv').config();

function connect() {
  try {

    const pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 7778,
    });
    return pool;
  } catch (error) {

    console.error('Error while connecting to the database :', error);
    throw error;
  }

}


module.exports = connect
