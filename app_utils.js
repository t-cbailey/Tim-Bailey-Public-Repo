// const format = require("pg-format");

// exports.checkExists = (table, column, value) => {
//   const queryStr = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
//   return connection.query(queryStr, [value]).then((res) => {
//     if (res.rows.length === 0) {
//       return Promise.reject({ status: 404, msg: "Resource not found" });
//     }
//   });
// };
