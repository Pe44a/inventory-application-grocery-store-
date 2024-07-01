#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Category = require("./models/category");
  const Inventory = require("./models/inventory");
  
  const categories = [];
  const inventories = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createInventories();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
// The index parameter in the ...Create functions ensures consistent array positioning.
// For example, categories[0] will always refer to the same category,
// regardless of the order in which the Promise.all() calls resolve.
  async function categoryCreate(index, name, description) {
    const category = new Category({ name: name, description: description });
    await category.save();
    categories[index] = category;
    console.log(`Add category: ${name}`);
  }
  
  async function inventoryCreate(index, name, description, category, price, numberInStock) {
    const inventory = new Inventory({ name: name, description: description, category: category,price: price, numberInStock: numberInStock});
  
    await inventory.save();
    inventories[index] = inventory;
    console.log(`Added item: ${name}`);
  }  
  

  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Fruits", "Fresh fruits from local and exotic sources"),
      categoryCreate(1, "Vegetables", "Organic and conventionally grown vegetables"),
      categoryCreate(2, "Dairy", "Milk, cheese, yogurt, and other dairy products"),
      categoryCreate(3, "Bakery", "Fresh bread, pastries, and baked goods"),
      categoryCreate(4, "Meat", "Fresh and frozen meat products"),
      categoryCreate(5, "Beverages", "Soft drinks, juices, and other non-alcoholic beverages")
    ]);
  }
  
  async function createInventories() {
    console.log("Adding inventory items");
    await Promise.all([
      inventoryCreate(0, "Apples", "Fresh, crisp apples", categories[0]._id, 1.99, 100),
      inventoryCreate(1, "Bananas", "Ripe yellow bananas", categories[0]._id, 0.99, 150),
      inventoryCreate(2, "Carrots", "Organic carrots", categories[1]._id, 1.49, 80),
      inventoryCreate(3, "Broccoli", "Fresh broccoli crowns", categories[1]._id, 2.29, 60),
      inventoryCreate(4, "Milk", "Whole milk, 1 gallon", categories[2]._id, 3.49, 40),
      inventoryCreate(5, "Cheddar Cheese", "Sharp cheddar cheese", categories[2]._id, 4.99, 30),
      inventoryCreate(6, "Whole Wheat Bread", "Freshly baked whole wheat bread", categories[3]._id, 2.99, 25),
      inventoryCreate(7, "Croissants", "Butter croissants", categories[3]._id, 0.99, 50),
      inventoryCreate(8, "Chicken Breast", "Boneless, skinless chicken breast", categories[4]._id, 5.99, 35),
      inventoryCreate(9, "Ground Beef", "Lean ground beef", categories[4]._id, 4.99, 40),
      inventoryCreate(10, "Orange Juice", "Fresh squeezed orange juice", categories[5]._id, 3.99, 20),
      inventoryCreate(11, "Sparkling Water", "Unflavored sparkling water", categories[5]._id, 1.49, 60)
    ]);
  }