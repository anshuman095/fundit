import { Router } from "express";
import {
  createUpdateDraft,
  deleteDraft,
  deleteEmail,
  getAllEmails,
  getDraft,
  getEmailMessage,
  getGmailLabels,
  getGmailProfile,
  handleGoogleCallback,
  handleGoogleLogin,
  sendDraft,
  sendEmail,
  toggleStarEmail,
} from "../../Controller/gmailController.js";
import { saveRedirectUri, validate } from "../../helper/general.js";
import { idsSchema, labelSchema, sendEmailSchema, socialMediaSecretSchema } from "../../helper/validations.js";
import { checkAccessToken } from "../../helper/tokenVerify.js";
const gmailRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Gmail
 *   description: Operations related to gmail
 */

gmailRoutes.post("/auth/google", validate(socialMediaSecretSchema), handleGoogleLogin);

gmailRoutes.get("/auth/google/callback", handleGoogleCallback);

/**
 * @swagger
 * /api/google/get-gmail-profile:
 *   get:
 *     summary: Get Gmail Profile
 *     description: Retrieve the Gmail profile and associated labels for the authenticated user.
 *     tags: [Gmail]
 *     responses:
 *       200:
 *         description: Successfully retrieved Gmail profile and labels.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: The status of the operation.
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The Gmail profile data.
 *                   properties:
 *                     emailAddress:
 *                       type: string
 *                       description: The email address of the user.
 *                       example: user@gmail.com
 *                     messagesTotal:
 *                       type: integer
 *                       description: Total number of messages in the Gmail account.
 *                       example: 1000
 *                     threadsTotal:
 *                       type: integer
 *                       description: Total number of threads in the Gmail account.
 *                       example: 500
 *                 labels:
 *                   type: array
 *                   description: List of Gmail labels.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The label ID.
 *                         example: INBOX
 *                       name:
 *                         type: string
 *                         description: The label name.
 *                         example: Inbox
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: The status of the operation.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Error during getting gmail profile: invalid_token"
 */

gmailRoutes.get("/get-gmail-profile", getGmailProfile);

gmailRoutes.get("/get-gmail-labels", getGmailLabels);

/**
 * @swagger
 * /api/google/get-emails:
 *   get:
 *     summary: Retrieve a list of emails from Gmail
 *     description: Fetch emails from the authenticated user's Gmail account with optional filtering, pagination, and search functionality.
 *     tags: [Gmail]
 *     parameters:
 *       - in: query
 *         name: label
 *         schema:
 *           type: string
 *         description: Gmail label to filter emails by (e.g., INBOX, SENT).
 *         example: INBOX
 *       - in: query
 *         name: pageToken
 *         schema:
 *           type: string
 *         description: Token for fetching the next page of results.
 *         example: "TOKEN12345"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query to filter emails (e.g., by subject or sender).
 *         example: "invoice"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of emails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       description: List of emails.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: Unique identifier for the email.
 *                             example: "12345abc"
 *                           threadId:
 *                             type: string
 *                             description: Thread ID the email belongs to.
 *                             example: "67890xyz"
 *                           from:
 *                             type: string
 *                             description: Sender of the email.
 *                             example: "example@example.com"
 *                           subject:
 *                             type: string
 *                             description: Subject of the email.
 *                             example: "Monthly Invoice"
 *                           snippet:
 *                             type: string
 *                             description: Email snippet (preview of the message body).
 *                             example: "This is a preview of the email content..."
 *                           date:
 *                             type: string
 *                             description: Localized date of the email.
 *                             example: "Tue, Nov 25 2024, 5:30:00 PM"
 *                     nextPageToken:
 *                       type: string
 *                       description: Token for fetching the next page of results.
 *                       example: "TOKEN67890"
 *                     resultSizeEstimate:
 *                       type: integer
 *                       description: Number of emails in the current result.
 *                       example: 10
 *                     totalEmailCount:
 *                       type: integer
 *                       description: Total number of emails matching the query.
 *                       example: 150
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message explaining what went wrong.
 *                   example: "Error during fetching emails: invalid_token"
 */

gmailRoutes.get("/get-emails", validate(labelSchema, "query"), getAllEmails);

/**
 * @swagger
 * /api/google/get-emails/{id}:
 *   get:
 *     summary: Retrieve details of a specific email message
 *     description: Fetch a detailed view of a specific email by its unique ID, including metadata, body content, and attachments.
 *     tags: [Gmail]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the email message to retrieve.
 *         example: "12345abc"
 *     responses:
 *       200:
 *         description: Successfully retrieved the email message details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique ID of the email message.
 *                       example: "12345abc"
 *                     threadId:
 *                       type: string
 *                       description: Thread ID the email belongs to.
 *                       example: "67890xyz"
 *                     subject:
 *                       type: string
 *                       description: Subject of the email.
 *                       example: "Monthly Invoice"
 *                     from:
 *                       type: string
 *                       description: Sender of the email.
 *                       example: "example@example.com"
 *                     to:
 *                       type: string
 *                       description: Recipient(s) of the email.
 *                       example: "recipient@example.com"
 *                     date:
 *                       type: string
 *                       description: Localized date of the email.
 *                       example: "Tue, Nov 25 2024, 5:30:00 PM"
 *                     body:
 *                       type: string
 *                       description: Full content of the email body.
 *                       example: "<p>Hello, this is the email content.</p>"
 *                     attachments:
 *                       type: array
 *                       description: List of attachments included in the email.
 *                       items:
 *                         type: object
 *                         properties:
 *                           filename:
 *                             type: string
 *                             description: Name of the attachment file.
 *                             example: "invoice.pdf"
 *                           attachmentId:
 *                             type: string
 *                             description: Unique ID of the attachment.
 *                             example: "attachment123"
 *                           base64EncodedAttachment:
 *                             type: string
 *                             description: Base64 encoded content of the attachment.
 *                             example: "VGhpcyBpcyBhbiBleGFtcGxlIGF0dGFjaG1lbnQ="
 *       404:
 *         description: Email not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Email not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error during fetching email details: invalid_token"
 */

gmailRoutes.get("/get-emails/:id", getEmailMessage);

/**
 * @swagger
 * /api/google/send-email:
 *   post:
 *     summary: Send an email with optional attachments
 *     description: Sends an email to the specified recipient(s) using the Gmail API. Supports attachments.
 *     tags: [Gmail]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient email address(es). For multiple recipients, use a comma-separated string.
 *                 example: "recipient@example.com, another@example.com"
 *               subject:
 *                 type: string
 *                 description: Subject of the email.
 *                 example: "Meeting Reminder"
 *               body:
 *                 type: string
 *                 description: Body content of the email.
 *                 example: "This is a reminder for our meeting scheduled tomorrow at 10:00 AM."
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional email attachments.
 *     responses:
 *       201:
 *         description: Email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Email sent successfully"
 *                 data:
 *                   type: object
 *                   description: Response data from Gmail API.
 *       400:
 *         description: Bad request, invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid email address"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error during email sending: invalid_token"
 */

gmailRoutes.post("/send-email", validate(sendEmailSchema), sendEmail);

/**
 * @swagger
 * /api/google/delete-email:
 *   delete:
 *     summary: Delete multiple emails
 *     description: Deletes emails with the specified IDs using the Gmail API.
 *     tags: [Gmail]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of email IDs to delete.
 *                 example: ["17c1a2b3cd456ef7", "18d4e2f3gh678ij9"]
 *     responses:
 *       200:
 *         description: Emails deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Email deleted successfully"
 *       400:
 *         description: Bad request, invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid email IDs"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates the success of the operation.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: "Error during email deletion: invalid_token"
 */

gmailRoutes.post("/delete-email", validate(idsSchema), deleteEmail);

gmailRoutes.post("/create-update-draft", createUpdateDraft);
gmailRoutes.post("/send-draft", sendDraft);
gmailRoutes.get("/get-draft/:draftId?", getDraft);
gmailRoutes.post("/delete-draft", validate(idsSchema), deleteDraft);
gmailRoutes.post("/starr-email", toggleStarEmail);

export default gmailRoutes;
