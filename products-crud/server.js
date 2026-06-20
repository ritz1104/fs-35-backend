const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const ProductModel = require("./src/models/product.model");

connectDB();

const app = express();

app.use(express.json());

// creation


app.get("/api/product", async (req, res) => {
  try {
    let allProducts = await ProductModel.find();

    return res.status(200).json({
      success: true,
      message: "All products fetched",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.patch("/api/product/update/:productId", async (req, res) => {
  try {
    let { productId } = req.params;

    let { productName, description, category, imageUrl, currency, amount } =
      req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        productName,
        description,
        category,
        imageUrl,
        price: {
          currency,
          amount,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/api/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId);

    return res.status(200).json({
      success: true,
      message: "product fetched",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.delete("/api/product/delete/:productId", async (req, res) => {
  try {
    let { productId } = req.params;

    await ProductModel.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
