import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import { makeDb } from "../db-config.js";
import {
  createQueryBuilder,
  decodeData,
  deleteFilesInFolder,
  encodedData,
  saveBase64Image,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import AboutUs from "../sequelize/aboutUsSchema.js";

const db = makeDb();

// export const createUpdateAboutUs = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;
//     const { description, title, sub_title } = req.body;
//     // if (req.files && req.files.image) {
//     //   req.body.image = await uploadFile("about_us", req.files.image);
//     // }
//     if (req.body.image) {
//       req.body.image = saveBase64Image(req.body.image, "about_us", "about_us");
//     }
//     if (description) req.body.description = JSON.stringify(await encodedData(req.body.description, "description"));
//     if (title) req.body.title = JSON.stringify(await encodedData(req.body.title, "title"));

//     if (sub_title) req.body.sub_title = JSON.stringify(await encodedData(req.body.sub_title, "sub_title"));
//     if (id) {
//       const { query, values } = updateQueryBuilder(AboutUs, req.body);
//       await db.query(query, values);
//       return res.status(200).json({
//         status: true,
//         message: "About us updated successfully",
//       });
//     } else {
//       const { query, values } = createQueryBuilder(AboutUs, req.body);
//       await db.query(query, values);
//       return res.status(200).json({
//         status: true,
//         message: "About us created successfully",
//       });
//     }
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

export const createUpdateAboutUs = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    const sections = JSON.parse(req.body.sections);
    if (sections.length === 0) {
      await deleteFilesInFolder("about_us");
    }
    // const sectionsRegex = /^sections\[(\d+)\]\.media$/;
    // const sectionsRegex = /^sections\[(\d+)\]\[media\]$/;
    for (let i = 0; i < sections.length; i++) {
      const slide = sections[i];
      const file = req.files && req.files[`sections[${i}][media]`];

      let filepath = "";
      if (typeof file !== "string" && typeof file !== "undefined" && file !== null) {
        slide.media = await uploadFile("about_us", file);
      }
    }
    let statusCode;
    req.body.sections = JSON.stringify(sections);
    if (id) {
      statusCode = 200;
      const { query, values } = updateQueryBuilder(AboutUs, req.body);
      await db.query(query, values);
    } else {
      statusCode = 201;
      const { query, values } = createQueryBuilder(AboutUs, req.body);
      await db.query(query, values);
    }
    // for (const entry of sections) {
    //   const { description, title } = entry;

    //   // Encode description, title, and sub_title if provided
    //   if (description) entry.description = JSON.stringify(await encodedData(description, "description"));
    //   if (title) entry.title = JSON.stringify(await encodedData(title, "title"));

    //   // Update or create entry based on the presence of `id`
    //   if (id) {
    //     statusCode = 200;
    //     const { query, values } = updateQueryBuilder(AboutUs, entry);
    //     await db.query(query, values);
    //   } else {
    //     statusCode = 201;
    //     const { query, values } = createQueryBuilder(AboutUs, entry);
    //     await db.query(query, values);
    //   }
    // }

    return res.status(statusCode).json({
      status: true,
      message: "About us entries processed successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getAboutUs = asyncHandler(async (req, res) => {
  try {
    const getAboutUsQuery = `SELECT * FROM about_us`;
    const getAboutUs = await db.query(getAboutUsQuery);
    // for (const data of getAboutUs) {
    //   data.description = JSON.parse(await decodeData(data.description, "description"));
    //   data.title = JSON.parse(await decodeData(data.title, "title"));
    // }

    if (getAboutUs.length === 0) {
      return res.status(404).json({
        status: false,
        message: "About us Not Found",
      });
    }

    getAboutUs.forEach((data) => {
      data.sections = JSON.parse(data.sections);
    });

    return res.status(200).json({
      status: true,
      data: getAboutUs,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
