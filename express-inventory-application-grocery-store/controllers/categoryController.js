const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const Inventory = require("../models/inventory")
const { body, validationResult } = require("express-validator");


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

// Display category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', { title: 'Create Category' });
});

// Handle category create on POST
exports.category_create_post = [
  // Validate and sanitize fields
  body('name', 'Category name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Category description must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render('category_form', {
        title: 'Create Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      // Check if Category with same name already exists
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        // Category exists, redirect to its detail page
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to category detail page
        res.redirect(category.url);
      }
    }
  }),
];

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