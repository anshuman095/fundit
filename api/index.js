import express from "express";
import path from "path";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import session from "express-session";
import swaggerSpec from "./swagger.config.js";
import { makeDb } from "./db-config.js";
const db = makeDb();

const app = express();

import routes from "./Routes/adminRoutes/index.js";
import clientRoutes from "./Routes/clientRoutes/clientRoutes.js";
import swaggerUi from "swagger-ui-express";
import { getProfile } from "./Controller/adminController.js";
import { verifyToken } from "./helper/tokenVerify.js";
import { saveRedirectUri } from "./helper/general.js";

dotenv.config();

const PORT = process.env.PORT || 8003;

app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.resolve("./public")));
app.use(session({ secret: "some secret", resave: false, saveUninitialized: true }));

app.get("/api/get-profile/:id", verifyToken, getProfile);

app.use(saveRedirectUri);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", routes);
app.use("/api/client", clientRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
