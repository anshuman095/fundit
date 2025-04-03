import { Router } from "express";
import { getDonationsByDateRange, getRecentDonation, getSummary } from "../../Controller/dashboardController.js";

const dashboard = Router();

dashboard.post("/donation", getDonationsByDateRange);

dashboard.get("/get-summary/:range", getSummary);

dashboard.get("/recent-donation", getRecentDonation);

export default dashboard;
