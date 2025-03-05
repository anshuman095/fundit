import { Router } from "express";
import { createUpdateOurTeam, getOurTeam } from "../../Controller/ourTeamController.js";

const ourTeamRoutes = Router();

ourTeamRoutes.post("/create-update-team", createUpdateOurTeam);
ourTeamRoutes.get("/get-our-team/:id?", getOurTeam);

export default ourTeamRoutes;
