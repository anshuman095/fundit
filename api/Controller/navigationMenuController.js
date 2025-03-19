import asyncHandler from "express-async-handler";
import { makeDb } from "../db-config.js";
import NavigationMenu from "../sequelize/navigationMenuSchema.js";
import { createQueryBuilder, deleteRecord, storeError, updateQueryBuilder } from "../helper/general.js";
const db = makeDb();

export const addNavigationMenu = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    req.body.menu_items = JSON.stringify(req.body.menu_items);

    if (id) {
      const { query, values } = updateQueryBuilder(NavigationMenu, req.body);
      await db.query(query, values);
    } else {
      const { query, values } = createQueryBuilder(NavigationMenu, req.body);
      await db.query(query, values);
    }
    return res.status(200).json({
      status: true,
      message: "Navigation menu processed successfully",
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const getNavigationMenu = asyncHandler(async (req, res) => {
  try {
    let where = "";
    if (req.params?.id) {
      where = `AND id = ${req.params.id}`;
    }
    const getNavigationQuery = `SELECT * FROM navigation_menu`;
    const getNavigation = await db.query(getNavigationQuery);
    if (getNavigation.length == 0) {
      return res.status(404).json({
        status: false,
        message: "Navigation menu Not Found",
      });
    }
    return res.status(200).json({
      status: true,
      data: getNavigation[0],
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteNavigationMenu = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleteNavigationQuery = await deleteRecord("navigation_menu", id);
    if (deleteNavigationQuery) {
      return res.status(200).json({
        status: true,
        message: "Navigation menu deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Navigation menu not found",
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

export const getNavigationMenuChild = asyncHandler(async (req, res) => {
  try {
    let where = "";
    if (req.params?.id) {
      where = `AND id = ${req.params.id}`;
    }
    const getNavigationQuery = `SELECT * FROM navigation_menu`;
    const getNavigation = await db.query(getNavigationQuery);
    if (getNavigation.length == 0) {
      return res.status(404).json({
        status: false,
        message: "Navigation menu Not Found",
      });
    }
    let menuItems = getNavigation[0]?.menu_items || [];

    let menuMap = new Map();

    menuItems?.forEach((item) => {
      menuMap.set(item.title, { ...item, children: [] });
    });

    let rootMenus = [];

    menuItems?.forEach((item) => {
      if (item.parent_menu && menuMap.has(item.parent_menu)) {
        menuMap.get(item.parent_menu).children.push(menuMap.get(item.title));
      } else {
        rootMenus.push(menuMap.get(item.title));
      }
    });
    return res.status(200).json({
      status: true,
      data: rootMenus,
    });
  } catch (error) {
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});