import { Router } from "express";
import { moduleSchema, productSchema } from "../../helper/validations.js";
import { validate } from "../../helper/general.js";
import { createUpdateModule, getModules } from "../../Controller/moduleController.js";
import { verifyToken } from "../../helper/tokenVerify.js";

const moduleRoutes = Router();

moduleRoutes.post("/create-update-module", validate(moduleSchema), createUpdateModule);

moduleRoutes.get("/get-modules/:id?", verifyToken, getModules);

export default moduleRoutes;
