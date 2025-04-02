import { Router } from "express";
import { validate } from "../../helper/general.js";
import { getDonationsByDateRange } from "../../Controller/dashboardController.js";

const dashboard = Router();

dashboard.get("/get-dashboard/:id?", getDonationsByDateRange);

export default dashboard;
