import ContactForm from "../sequelize/contactFormSchema.js";
import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import {
  createNotification,
  createQueryBuilder,
  deleteRecord,
  generateReplyEmail,
  getAdminData,
  sendEmail,
  storeError,
  tableRecord,
  updateQueryBuilder,
} from "../helper/general.js";
const db = makeDb();

export const createUpdateContactForm = asyncHandler(async (req, res) => {
  try {
    const io = req.app.get("io");
    const { id } = req.body;
    if (id) {
      const { query, values } = updateQueryBuilder(ContactForm, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Contact form updated successfully",
      });
    }
    const userExists = await tableRecord("email", req.body.email, "contact_form");
    if (userExists.length > 0) {
      return res.status(409).json({
        status: false,
        message: "You already contacted.",
      });
    }
    const { query, values } = createQueryBuilder(ContactForm, req.body);
    const result = await db.query(query, values);
    
    const admin = await getAdminData();
    const data = {
      user_id: admin?.id,
      subject: "Contact Form",
      message: `${req.body.full_name} has submitted a contact form regarding ${req.body.subject}.`,
      redirect_url: "/website-query",
      view_notify: result.insertId,
    }
    await createNotification(data, io);

    return res.status(201).json({
      status: true,
      message: "Contact details sent successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getContactForm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let offset = (page - 1) * pageSize;
    const { search, filter } = req.query;
    let where = "WHERE deleted = 0";
    if (id) {
      where += ` AND id = ${id}`;
    }
    if (filter) {
      where += ` AND id = ${filter}`;
    }
    if (search) {
      where += ` AND (full_name LIKE '%${search}%' OR mobile LIKE '%${search}%')`;
    }
    const query = `SELECT * FROM contact_form ${where} LIMIT ${pageSize} OFFSET ${offset}`;
    const results = await db.query(query);
    if (results.length == 0) {
      return res.status(200).json({
        status: true,
        message: [],
      });
    }
    return res.status(200).json({
      status: true,
      data: id ? results : results,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteContactForm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteContactForm = await deleteRecord("contact_form", id);
    if (deleteContactForm) {
      return res.status(200).json({
        status: true,
        message: "Contact form deleted successfully",
      });
    }
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const replyContactForm = asyncHandler(async (req, res) => {
  try {
    const { id, reply } = req.body;
    const contactForm = await tableRecord("id", id, "contact_form");
    if (contactForm.length == 0) {
      return res.status(409).json({
        status: false,
        message: "Contact form not found",
      });
    }

    const html = generateReplyEmail("contact", contactForm[0].username, contactForm[0].message, reply);
    const email = contactForm[0].email;
    const response = await sendEmail("volthi@admin.com", email, "Response to Your Contact Request", html);
    if (response.status) {
      console.log(response.message);
    } else {
      throw new Error(response.message);
    }
    const { query, values } = updateQueryBuilder(ContactForm, req.body);
    await db.query(query, values);
    return res.status(200).json({
      status: true,
      message: "Contact form replied successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
