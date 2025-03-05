import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function sendEmail(fromMail, toMail, subjectData, sendRecordArray) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.hostName,
      port: process.env.portNumber,
      auth: {
        user: process.env.authUser,
        pass: process.env.authPassword,
      },
    });
    const data = await returnData(sendRecordArray);
    const templatePath = path.resolve(__dirname, `../${sendRecordArray.templateFileUrl}`);
    const template = fs.readFileSync(templatePath, "utf-8");

    // Replace multiple placeholders dynamically
    let htmlBody = template;
    for (const key in data) {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlBody = htmlBody.replace(regex, data[key]);
    }

    let mailOptions = { from: fromMail, to: toMail, subject: subjectData, html: htmlBody };
    let info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return {
      status: false,
      message: "Error sending email",
    };
  }
}

/**Send Data According to mail*/
export const returnData = async (sendRecordArray) => {
  if (sendRecordArray.templateFileUrl == "forgot_password_template.html") {
    const data = {
      name: sendRecordArray.name,
      otp: sendRecordArray.otp,
    };
    return data
  } else {
    const data = {
      name: sendRecordArray.name,
      otp: sendRecordArray.otp,
    };
    return data
  }

};


export default sendEmail;
