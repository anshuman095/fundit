import { Router } from "express";
import { validate } from "../../helper/general.js";
import { getDonationsByDateRange } from "../../Controller/dashboardController.js";

const dashboard = Router();

dashboard.post("/donation", getDonationsByDateRange);

export default dashboard;
