import { storeError, getRolePermission } from "../helper/general.js";
import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
const db = makeDb();

export const getPermissions = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  try {
    const hierarchy = await getRolePermission(roleId);
    return res.status(200).json({ status: true, data: [{ data: hierarchy }] });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const setPermission = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  console.log("roleId: ", roleId);
  const { permissions } = req.body;
  // console.log("permissions: ", permissions);

  if (!roleId || !permissions) {
    return res.status(400).json({
      status: false,
      message: "Role ID and permissions data are required.",
    });
  }

  try {
    const role = await db.query("SELECT * FROM roles WHERE id = ?", [roleId]);
    if (role.length === 0) {
      return res.status(404).json({ status: false, message: "Role not found" });
    }

    const flattenPermissions = (modules) => {
      const flattened = [];
      const processModule = (module) => {
        flattened.push({
          module_id: module.module_id,
          create: module.create || 0,
          read: module.read || 0,
          update: module.update || 0,
          delete: module.delete || 0,
        });

        if (module.children && module.children.length > 0) {
          module.children.forEach(processModule);
        }
      };

      modules.forEach(processModule);
      return flattened;
    };

    const flattenedPermissions = flattenPermissions(permissions);

    const upsertPromises = flattenedPermissions.map(async (perm) => {
      const existingPermission = await db.query("SELECT * FROM permission WHERE role_id = ? AND module_id = ?", [
        roleId,
        perm.module_id,
      ]);

      if (existingPermission.length > 0) {
        return db.query(
          "UPDATE permission SET `create` = ?, `read` = ?, `update` = ?, `delete` = ? WHERE role_id = ? AND module_id = ?",
          [perm.create, perm.read, perm.update, perm.delete, roleId, perm.module_id]
        );
      } else {
        return db.query(
          "INSERT INTO permission (role_id, module_id, `create`, `read`, `update`, `delete`) VALUES (?, ?, ?, ?, ?, ?)",
          [roleId, perm.module_id, perm.create, perm.read, perm.update, perm.delete]
        );
      }
    });

    await Promise.all(upsertPromises);

    res.status(200).json({
      status: true,
      message: "Permissions updated successfully.",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});
