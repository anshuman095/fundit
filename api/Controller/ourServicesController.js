import { v4 as uuidv4 } from "uuid";
import { makeDb } from "../db-config.js";
import asyncHandler from "express-async-handler";
import {
  createQueryBuilder,
  deleteFilesInFolder,
  deleteRecord,
  makeWhereCondition,
  storeError,
  updateQueryBuilder,
  uploadFile,
} from "../helper/general.js";
import Services from "../sequelize/serviceSchema.js";

const db = makeDb();

// export const createUpdateOurServices = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (id) {
//       const { query, values } = updateQueryBuilder(OurServices, req.body);
//       await db.query(query, values);
//       return res.status(200).json({
//         status: true,
//         message: "Our services updated successfully",
//       });
//     }
//     const { query, values } = createQueryBuilder(OurServices, req.body);
//     await db.query(query, values);
//     return res.status(200).json({
//       status: true,
//       message: "Our services created successfully",
//     });
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

// export const getOurService = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (id) {
//       const getOurServiceQuery = `SELECT * FROM our_services where deleted = 0`;
//       const getServicesQuery = `SELECT * FROM services where deleted = 0 AND id = ${id}`;
//       const getServices = await db.query(getServicesQuery);
//       const getOurService = await db.query(getOurServiceQuery);
//       getOurService[0].services = getServices[0];
//       return res.status(200).json({
//         status: true,
//         data: getOurService[0],
//       });
//     }
//     const getOurServiceQuery = `SELECT * FROM our_services where deleted = 0`;
//     const getServicesQuery = `SELECT * FROM services where deleted = 0 `;
//     const getServices = await db.query(getServicesQuery);
//     const getOurService = await db.query(getOurServiceQuery);
//     getOurService[0].services = getServices;
//     return res.status(200).json({
//       status: true,
//       data: getOurService[0],
//     });
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

// export const createUpdateService = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (id) {
//       const { query, values } = updateQueryBuilder(Services, req.body);
//       await db.query(query, values);
//       return res.status(200).json({
//         status: true,
//         message: "Services updated successfully",
//       });
//     }
//     const { query, values } = createQueryBuilder(Services, req.body);
//     await db.query(query, values);
//     return res.status(200).json({
//       status: true,
//       message: "Services created successfully",
//     });
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

// export const createUpdateService = asyncHandler(async (req, res) => {
//   try {
//     const { id } = req.body;
//     const sections = JSON.parse(req.body.sections);
//     if (sections.length === 0) {
//       await deleteFilesInFolder("services");
//     }
//     // const sectionsRegex = /^sections\[(\d+)\]\.media$/;
//     // const sectionsRegex = /^sections\[(\d+)\]\[media\]$/;
//     for (let i = 0; i < sections.length; i++) {
//       const slide = sections[i];
//       const file = req.files && req.files[`sections[${i}][media]`];

//       let filepath = "";
//       if (typeof file !== "string" && typeof file !== "undefined" && file !== null) {
//         slide.media = await uploadFile("services", file);
//       }
//     }
//     req.body.sections = JSON.stringify(sections);
//     if (id) {
//       statusCode = 200;
//       const { query, values } = updateQueryBuilder(Services, req.body);
//       await db.query(query, values);
//     } else {
//       statusCode = 201;
//       const { query, values } = createQueryBuilder(Services, req.body);
//       await db.query(query, values);
//     }

//     return res.status(statusCode).json({
//       status: true,
//       message: "Services processed successfully",
//     });
//   } catch (error) {
//     storeError(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// });

export const createUpdateService = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (req.files && req.files.image) {
      req.body.image = await uploadFile("services", req.files.image);
    }

    if (id) {
      const { query, values } = updateQueryBuilder(Services, req.body);
      await db.query(query, values);
      return res.status(200).json({
        status: true,
        message: "Service updated successfully",
      });
    } else {
      const { query, values } = createQueryBuilder(Services, req.body);
      await db.query(query, values);
      return res.status(201).json({
        status: true,
        message: "Service created successfully",
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

export const getServices = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.query.status;
    let where = [];
    if (status) {
      where.push(`status = '${status}'`);
    }
    if (id) {
      where.push(`id = ${id}`);
    }
    const query = `SELECT * FROM services ${where.length > 0 ? "WHERE " + where.join(" AND ") : ""}`;
    let getServices = await db.query(query);

    if (getServices.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Service Not Found",
      });
    }

    return res.status(200).json({
      status: true,
      data: id ? getServices[0] : getServices,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteServices = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteServicesQuery = await deleteRecord("services", id);
    if (deleteServicesQuery) {
      return res.status(200).json({
        status: true,
        message: "Services deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Services not found",
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
