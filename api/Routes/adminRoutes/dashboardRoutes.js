import { Router } from "express";
import { getDonationGrowth, getDonationsByDateRange, getRecentDonation, getSummary } from "../../Controller/dashboardController.js";

const dashboard = Router();

dashboard.get("/donation", getDonationsByDateRange);

dashboard.get("/get-summary", getSummary);

dashboard.get("/recent-donation", getRecentDonation);

dashboard.get("/donation-growth", getDonationGrowth);

export default dashboard;
