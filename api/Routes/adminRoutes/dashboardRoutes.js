import { Router } from "express";
import { validate } from "../../helper/general.js";
import { getDonationsByDateRange } from "../../Controller/dashboardController.js";

const dashboard = Router();

dashboard.get("/donation", getDonationsByDateRange);

export default dashboard;
