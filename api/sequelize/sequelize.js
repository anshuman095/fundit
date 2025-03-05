import { Sequelize } from "sequelize";
// Create a new Sequelize instance
const sequelize = new Sequelize("volt_hi", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});
export default sequelize;
