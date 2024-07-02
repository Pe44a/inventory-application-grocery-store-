const Inventory = require("../models/inventory");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("inventory_form", { title: "Create Inventory Item", categories: allCategories });
});

// Handle Inventory create on POST.
  exports.inventory_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
      if (!Array.isArray(req.body.genre)) {
        req.body.inventory =
          typeof req.body.inventory === "undefined" ? [] : [req.body.genre];
      }
      next();
    },
  
    // Validate and sanitize fields.
    body("name", "Name must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("description", "Description must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("category", "Please select category.")
      .escape(),
    body("price", "Price must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("numberInStock")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    // Process request after validation and sanitization.
  
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a Book object with escaped and trimmed data.
      const inventory = new Inventory({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      res.render("inventory_form", {
        title: "Create Inventory Item",
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save inventory item.
      await inventory.save();
      res.redirect(inventory.url);
    }
  }),
  ];

// Display Inventory delete page on GET.
exports.inventory_delete_get = asyncHandler(async (req, res, next) => {
  const inventory = await Inventory.findById(req.params.id).exec();
  const category = await Category.findById(inventory.category._id).exec();

  if (inventory === null) {
    res.redirect('/catalog/inventories');
  }

  res.render('inventory_delete', {
    title: 'Delete Inventory Item',
    inventory: inventory,
    category: category
  });
});

// Handle Inventory delete on POST.
exports.inventory_delete_post = asyncHandler(async (req, res, next) => {

  await Inventory.findByIdAndDelete(req.body.inventoryid);
  res.redirect("/catalog/inventories");
});

// Display Inventory update page on GET.
exports.inventory_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Inventory update GET");
});

// Handle Inventory update on POST.
exports.inventory_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Inventory update POST");
});
