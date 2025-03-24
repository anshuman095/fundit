import { Router } from "express";
import { validate } from "../../helper/general.js";
import { getEmail, handleEmailCredential } from "../../Controller/emailController.js";
// import { LanguageCultureSchema } from "../../helper/validations.js";

const email = Router();

email.post("/create-update-email", handleEmailCredential);

email.get("/get-email/:id?", getEmail);

export default email;
