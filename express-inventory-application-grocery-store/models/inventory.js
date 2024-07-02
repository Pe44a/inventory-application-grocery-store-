const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  name: { type: String, maxLength: 100, required: true},
  description: { type: String, maxLength: 150, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, min:0, required: true },
  numberInStock: {type:Number, min:0, required: true }
});

// Virtual for author's URL
InventorySchema.virtual("url").get(function () {
  return `/catalog/inventory/${this._id}`;
});

// Export model
module.exports = mongoose.model("Inventory", InventorySchema);