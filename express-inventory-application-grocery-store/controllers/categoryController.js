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
  const category = await Category.findById(req.params.id)
  
  if (itemsInCategory == null) {
    const err = new Error('Inventory item not found');
    err.status = 404;
    return next(err);
  }

  // Render the "inventory_detail" view with the data
  res.render('category_detail', { 
    category: category,
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

// Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, itemsWithCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Inventory.find({ category: req.params.id }, {'name':1}).exec()
  ]);

  if (category === null) {
    res.redirect('/catalog/categories');
  }

  res.render('category_delete', {
    title: 'Delete Category',
    category: category,
    category_items: itemsWithCategory
  });
});

// Handle category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, itemsWithCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name').exec()
  ]);

  if (itemsWithCategory.length > 0) {
    // Category has items. Render in same way as for GET route.
    res.render('category_delete', {
      title: 'Delete Category',
      category: category,
      category_items: itemsWithCategory
    });
    return;
  } else {
    // Category has no items. Delete object and redirect to the list of categories.
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect('/catalog/categories');
  }
});

// Display book update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  // Get category for form.
  const category = await Category.findById(req.params.id)

  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_form", {
    title: "Update Category",
    category: category
  });
});

// Handle Category update on POST.
exports.category_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
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

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      const category = await Category.findById(req.params.id)

      if (category === null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
    
      res.render("category_form", {
        title: "Update Category",
        category: category
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      // Redirect to category detail page.
      res.redirect(updatedCategory.url);
    }
  })
];