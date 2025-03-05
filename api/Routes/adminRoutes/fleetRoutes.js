import { Router } from "express";
import { productSchema } from "../../helper/validations.js";
import { validate } from "../../helper/general.js";
import { createUpdateFleet, getFleets } from "../../Controller/fleetController.js";

const fleetRoutes = Router();

fleetRoutes.post("/create-update-fleet", createUpdateFleet);

fleetRoutes.get("/get-fleet/:id?", getFleets);

export default fleetRoutes;
