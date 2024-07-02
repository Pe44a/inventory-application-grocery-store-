const Inventory = require("../models/inventory");
const asyncHandler = require("express-async-handler");

// Display list of all Inventory items.
exports.inventory_list = asyncHandler(async (req, res, next) => {
  const allInventories = await Inventory.find().sort({ name: 1 }).exec();
  res.render("inventory_list", {
    title: "Inventory list",
    inventories_list: allInventories,
  });
});

// Display detail page for a specific Inventory item.
exports.inventory_detail = asyncHandler(async (req, res, next) => {  
  const inventory = await Inventory.findById(req.params.id).populate('category').exec();
  console.log(inventory)
  
  if (inventory == null) {
    const err = new Error('Inventory item not found');
    err.status = 404;
    return next(err);
  }

  // Render the "inventory_detail" view with the data
  res.render('inventory_detail', { 
    title: inventory.name,
    inventory: inventory,
  });
});

// Display Inventory create form on GET.
exports.inventory_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Inventory create GET");
});

// Handle Inventory create on POST.
exports.inventory_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Inventory create POST");
});

// Display Inventory delete page on GET.
exports.inventory_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Inventory delete GET");
});

// Handle Inventory delete on POST.
exports.inventory_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Inventory delete POST");
});

// Display Inventory update page on GET.
exports.inventory_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Inventory update GET");
});

// Handle Inventory update on POST.
exports.inventory_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Inventory update POST");
});
