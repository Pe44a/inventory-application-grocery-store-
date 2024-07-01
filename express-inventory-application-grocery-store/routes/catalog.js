const express = require("express");
const router = express.Router();

// Require controller modules.
const category_controller = require("../controllers/categoryController");
const inventory_controller = require("../controllers/inventoryController");


// GET catalog list
router.get("/", inventory_controller.inventory_list);


/// INVENTORY ROUTES ///

// GET request for one Inventory item.
router.get("/inventory/:id", inventory_controller.inventory_detail);

// GET request for list of all Inventory items.
router.get("/inventories", inventory_controller.inventory_list);

// GET request for creating Inventory item.
router.get("/inventory/create", inventory_controller.inventory_create_get);

// POST request for creating Inventory item.
router.post("/inventory/create", inventory_controller.inventory_create_post);

// GET request to delete Inventory item.
router.get("/inventory/:id/delete", inventory_controller.inventory_delete_get);

// POST request to delete Inventory item.
router.post("/inventory/:id/delete", inventory_controller.inventory_delete_post);

// GET request to update Inventory item.
router.get("/inventory/:id/update", inventory_controller.inventory_update_get);

// POST request to update Inventory item.
router.post("/inventory/:id/update", inventory_controller.inventory_update_post);


/// CATEGORY ROUTES ///

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Category items.
router.get("/categories", category_controller.category_list);

// GET request for creating a Category.
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);



module.exports = router;