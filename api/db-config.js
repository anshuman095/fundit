import mysql from "mysql2";
import util from "util";
const config = {
  host: "localhost",
  user: "root",
  password: "12345",
  database: "rk_mission",
};
export const con = mysql.createConnection(config);

export const makeDb = () => {
  const connection = mysql.createConnection(config);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
};
