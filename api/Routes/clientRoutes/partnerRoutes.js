import { Router } from "express";
import { getPartners } from "../../Controller/partnerController";

const partnerRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Operations related to Partners
 */

partnerRoutes.get("/get-partner/:id?", getPartners);

export default partnerRoutes;
