import sequelize from "./sequelize.js";
import fs from "fs";
import path from "path";
import { createQueryBuilder, hashPassword } from "../helper/general.js";
import { Admin } from "../helper/constants.js";
import User from "./userSchema.js";
const syncModels = async () => {
  const schemaDir = "sequelize";
  const files = fs.readdirSync(schemaDir);
  console.log(files);
  const fileMap = files.reduce((acc, file) => {
    if (file.endsWith("Schema.js")) {
      const filePath = path.join(process.cwd(), schemaDir, file).replace(/\\/g, "/");
      const modelName = file.replace("Schema.js", "");
      acc[modelName] = filePath;
    }
    return acc;
  }, {});

  const customOrder = [
    "role",
    "aboutUs",
    "banner",
    "blog",
    "contactForm",
    "contact",
    "fleet",
    "heroBannerSliderSetting",
    "heroBannerSlide",
    "linkedinPosts",
    "location",
    "module",
    "navigationMenu",
    "ourPartners",
    "ourTeam",
    "partner",
    "permissions",
    "post",
    "product",
    "queryForm",
    "sectionManager",
    "sequelize",
    "service",
    "socialMediaSecret",
    "syncDb",
    "testimonial",
    "user",
    "whoAreWe",
  ];

  for (const modelName of customOrder) {
    const filePath = fileMap[modelName];
    if (!filePath) {
      console.warn(`Schema for ${modelName} not found. Skipping.`);
      continue;
    }

    const module = await import(`file://${filePath}`);
    const model = module.default;
    await model.sync({ alter: true });
    console.log(`Model ${model.name} synchronized successfully.`);
  }

  // for (const file of files) {
  //   if (file.endsWith("Schema.js")) {
  //     const filePath = path.join(process.cwd(), schemaDir, file).replace(/\\/g, "/");
  //     const module = await import(`file://${filePath}`);
  //     const model = module.default;
  //     await model.sync({ alter: true });
  //     console.log(`Model ${model.name} synchronized successfully.`);
  //   }
  // }
};
const alterTableIfColumnExists = async (tableName) => {
  const alterColumn = async (columnName, alterQuery) => {
    const result = await sequelize.query(
      `
      SELECT COUNT(*) as count
      FROM information_schema.columns
      WHERE table_name = '${tableName}' AND column_name = '${columnName}';
    `,
      { type: sequelize.QueryTypes.SELECT }
    );
    if (result[0].count > 0) {
      await sequelize.query(alterQuery);
      console.log(`Column ${columnName} in table ${tableName} altered successfully`);
    } else {
      console.log(`Table ${tableName} does not have '${columnName}' column`);
    }
  };
  try {
    await alterColumn(
      "updated_at",
      `
      ALTER TABLE ${tableName}
      CHANGE updated_at updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
    `
    );
    await alterColumn(
      "created_at",
      `
      ALTER TABLE ${tableName}
      CHANGE created_at created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
    `
    );
  } catch (err) {
    console.error(`Error altering table ${tableName}:`, err);
  }
};

const ensureViewExists = async () => {
  try {
    const checkViewQuery = `
    SELECT COUNT(*) AS count
    FROM information_schema.views
    WHERE table_schema = 'rk_mission' AND table_name = 'users_view'
  `;

    const [result] = await sequelize.query(checkViewQuery);

    if (result[0].count === 0 || result[0].count === undefined) {
      const createViewQuery = `CREATE VIEW users_view AS SELECT users.id, users.username, users.image, users.full_name, users.email, users.mobile, users.status, users.address, users.asset, users.role_id, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.deleted = 0`;

      await sequelize.query(createViewQuery);
      return console.log("View created successfully");
    }
    console.log("view already exists");
  } catch (error) {
    console.error(`Error creating view users_view:`, error);
  }
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // Sync the models
    await syncModels();
    // Sync the dataBases with the models
    // await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
    // Fetch all table names from the database
    const tables = await sequelize.query(
      `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = '${sequelize.config.database}';
    `,
      { type: sequelize.QueryTypes.SELECT }
    );
    // Loop through each table and alter the table if the column exists
    for (const table of tables) {
      await alterTableIfColumnExists(table.table_name);
    }
    ensureViewExists();

    await initRolesAndAdmin();
    console.log("All tables were processed successfully.");
  } catch (error) {
    console.error("Unable to connect to the database or alter tables:", error);
  }
})();

const initRolesAndAdmin = async () => {
  try {
    const roles = [{ name: "Admin" }, { name: "User" }];

    const password = await hashPassword(Admin.password);
    const admin = {
      email: Admin.email,
      password: password,
      role_id: 1,
      username: "John",
      full_name: "John Wick",
    };

    for (const role of roles) {
      const [existingRole] = await sequelize.query(`SELECT * FROM roles WHERE name = '${role.name}'`);
      if (!existingRole.length) {
        await sequelize.query(`INSERT INTO roles (name) VALUES ('${role.name}')`);
      }
    }
    const [existingAdmin] = await sequelize.query(`SELECT * FROM users WHERE email = '${admin.email}'`);
    if (!existingAdmin.length) {
      sequelize.query(
        `INSERT INTO users (email, password, role_id, username, full_name) VALUES ('${admin.email}', '${admin.password}', '${admin.role_id}', '${admin.username}', '${admin.full_name}')`
      );
    }
  } catch (error) {
    console.error("something went wrong in creating roles and admin:", error);
  }
};
