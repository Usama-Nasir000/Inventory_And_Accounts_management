const connect = require('./connect');
// import { DB } from '../graphql/types/query-config';
const pool = connect();


const db = {

  query: (text, values, callback) => {
    return pool.query(text, values, callback)
  },
  connect: () => {
    return pool.connect();
  },
};


module.exports = { db }