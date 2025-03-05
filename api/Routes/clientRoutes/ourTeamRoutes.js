import { Router } from "express";
import { getOurTeam } from "../../Controller/ourTeamController";

const ourTeamRoutes = Router();

ourTeamRoutes.get("/get-our-team/:id?", getOurTeam);

export default ourTeamRoutes;
