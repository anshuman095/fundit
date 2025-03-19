import Contact from "../sequelize/contactSchema.js";
import asyncHandler from "express-async-handler";
import {
  createQueryBuilder,
  decodeData,
  deleteRecord,
  encodedData,
  storeError,
  tableRecord,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import { makeDb } from "../db-config.js";
const db = makeDb();

// export const createUpdateContact = asyncHandler(async (req, res) => {
//   try {
//     const { id, sections } = req.body;
//     for (const section of sections) {
//       if (section?.description) {
//         section.description = JSON.stringify(await encodedData(section.description, "description"));
//       }
//     }
//     req.body.sections = JSON.stringify(sections);
//     if (id) {
//       const { query, values } = updateQueryBuilder(Contact, req.body);
//       await db.query(query, values);
//       return res.status(200).json({
//         status: true,
//         message: "Contact updated successfully",
//       });
//     }
//     const { query, values } = createQueryBuilder(Contact, req.body);
//     await db.query(query, values);
//     return res.status(201).json({
//       status: true,
//       message: "Contact created successfully",
//     });
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

export const createUpdateContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    let sections = [];

    if (req.body.sections) {
      sections = JSON.parse(req.body.sections);
    }
    
    if (id) {
      const { query, values } = updateQueryBuilder(Contact, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Contact updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(Contact, req.body);
      await db.query(query, values);
      return res.status(201).json({
        status: true,
        message: "Contact created successfully",
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

export const getContact = asyncHandler(async (req, res) => {
  try {
    const query = `SELECT * FROM contact`;
    const getContact = await db.query(query);
    // for (const data of getContact) {
    //   data.sections = JSON.parse(data.sections);
    //   for (const section of data.sections) {
    //     if (section?.description) {
    //       section.description = JSON.parse(await decodeData(section.description, "description"));
    //     }
    //   }
    // }
    if (getContact.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Contact Not Found",
      });
    }
    return res.status(200).json({
      status: true,
      data: getContact[0],
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteContact = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteContact = await deleteRecord("contact", id);
    if (deleteContact) {
      return res.status(200).json({
        status: true,
        message: "Contact deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Contact not found",
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
