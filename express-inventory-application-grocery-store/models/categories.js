const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, maxLength: 100, required: true },
  description: { type: String, maxLength:150, require:true },
});

// Virtual for categories URL
CategorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

// Export model
module.exports = mongoose.model("Category", CategorySchema);
