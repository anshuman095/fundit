import { Router } from "express";
import { getFleets } from "../../Controller/fleetController";

const fleetRoutes = Router();

fleetRoutes.get("/get-fleet/:id?", getFleets);

export default fleetRoutes;
