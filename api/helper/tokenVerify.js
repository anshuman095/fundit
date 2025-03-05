import jwt from "jsonwebtoken";
import { makeDb } from "../db-config.js";
import { storeError } from "./general.js";
import asyncHandler from "express-async-handler";
import { getSecrets } from "../Controller/socialMediaSecretController.js";
import moment from "moment";

const db = makeDb();
/**Verify token  */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token is required",
      });
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: false,
          message: "Your token is expired please log in again",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
      return res.status(401).json({
        status: false,
        message: "Token is required",
      });

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err)
        return res.status(403).json({
          status: false,
          message: "Your token is expired please log in again",
        });

      req.user = decoded;
    });
    const checkAdmin = await db.query(
      `SELECT * FROM users WHERE id = ? and (role = 'admin' OR role = 'superAdmin') and deleted = 0`,
      [req.user.sessionId]
    );
    if (checkAdmin.length > 0) next();
    else {
      return res.status(403).json({
        status: false,
        message: "You do not have access to perform this action",
      });
    }
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const checkAccessToken = (type) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const [secret] = await getSecrets(type);

      if (!secret || !secret?.access_token) {
        return res.status(401).json({
          status: false,
          error: `${type} access token not found`,
        });
      }

      const currentTime = moment();
      const expirationTime = moment(secret.expires_at);

      // Check if the token has expired
      if (currentTime.isAfter(expirationTime)) {
        return res.status(401).json({
          status: false,
          error: `${type} access token has expired, please renew the token.`,
        });
      }

      next();
    } catch (error) {
      storeError(error);
      return res.status(500).json({ status: false, error: error.message });
    }
  });
};

export const publicUrlAccess = async (req, res, next) => {
  try {
    if (req.user) {
      const policy = await db.query(
        `SELECT policy_assigned_team,policy_owner FROM policy WHERE deleted = 0 AND id = ${req.params.id}`
      );
      if (!policy[0]) {
        return res.status(404).json({
          status: false,
          message: "Policy not found",
        });
      }
      const team = JSON.parse(policy[0]?.policy_assigned_team || `[]`);
      if (!team.includes(req.user.sessionid) && policy[0]?.policy_owner !== req.user.sessionid) {
        return res.status(403).json({ status: false, message: "Access Denied" });
      }
    }
    next();
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const checkPermission = async (req, res, next) => {
  try {
    const role_id = req.user.role_id;

    if (role_id === 1) return next();

    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const method = req.method;

    const actionMap = {
      GET: "read",
      DELETE: "delete",
      PUT: "update",
    };

    const action = actionMap[method] || (method === "POST" ? (req.body.id ? "updated" : "create") : null);
    console.log("action: ", action);

    const { pathname } = new URL(fullUrl);

    const dynamicParams = Object.values(req.params);
    let routes = pathname.split("/");
    console.log("routes: ", routes);
    for (let param of dynamicParams) {
      routes.splice(routes.lastIndexOf(param), 1);
    }
    const route = routes[2];
    console.log("route: ", route);
    if (!route) {
      return res.status(400).json({ status: false, message: "Invalid route" });
    }

    const query = `SELECT id FROM module WHERE JSON_CONTAINS(route, '["${route}"]')`;
    const [module] = await db.query(query);
    if (!module) {
      return res.status(400).json({ status: false, message: "Invalid route" });
    }

    // Fetch permissions for the role and module from the database
    const permissions = await db.query(
      `SELECT \`create\`, \`read\`, \`update\`, \`delete\` 
      FROM permission
      WHERE role_id = ? AND module_id = ?`,
      [2, module.id]
    );
    console.log("permissions: ", permissions);

    // Check if permissions exist in the database
    if (permissions.length === 0) {
      return res.status(403).json({
        message: "You do not have permission for this module",
      });
    }

    const permission = permissions[0][action];
    if (permission == 1) {
      return next();
    }

    // Otherwise, deny access
    return res.status(403).json({
      message: "You do not have permission to perform this action",
    });
  } catch (error) {
    console.error("Error checking permissions:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
