import { Sequelize } from "sequelize";
// Create a new Sequelize instance
const sequelize = new Sequelize("rk_mission", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});
export default sequelize;
