const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const Inventory = require("../models/inventory")

// Display home page 
exports.index = asyncHandler(async (req, res, next) => {
  res.render("index", {});
});


// Display list of all Categories.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Categories list",
    categories_list: allCategories,
  });
});

// Display inventory page with specific  Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const itemsInCategory = await Inventory.find({ category: req.params.id },{name:1}).exec();
  const categoryName = await Category.findById(req.params.id)
  
  if (itemsInCategory == null) {
    const err = new Error('Inventory item not found');
    err.status = 404;
    return next(err);
  }

  // Render the "inventory_detail" view with the data
  res.render('category_detail', { 
    category_name: categoryName,
    items_in_category: itemsInCategory
  });});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category create GET");
});

// Handle Category create on POST.
exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category create POST");
});

// Display Category delete page on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
});

// Display Category update page on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update POST");
});