const createProductController = async (req, res) => {
  try {
    const { productName, currency, amount, category, description, imageUrl } =
      req.body;

    if (!productName || !currency || !amount || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newProduct = await ProductModel.create({
      productName,
      description,
      category,
      price: {
        currency,
        amount,
      },
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: newProduct,
    });
  } catch (error) {
    console.log("error in create api", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createProductController = async (req, res) => {
  try {
    const { productName, currency, amount, category, description, imageUrl } =
      req.body;

    if (!productName || !currency || !amount || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newProduct = await ProductModel.create({
      productName,
      description,
      category,
      price: {
        currency,
        amount,
      },
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: newProduct,
    });
  } catch (error) {
    console.log("error in create api", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const createProductController = async (req, res) => {
  try {
    const { productName, currency, amount, category, description, imageUrl } =
      req.body;

    if (!productName || !currency || !amount || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newProduct = await ProductModel.create({
      productName,
      description,
      category,
      price: {
        currency,
        amount,
      },
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: newProduct,
    });
  } catch (error) {
    console.log("error in create api", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const createProductController = async (req, res) => {
  try {
    const { productName, currency, amount, category, description, imageUrl } =
      req.body;

    if (!productName || !currency || !amount || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newProduct = await ProductModel.create({
      productName,
      description,
      category,
      price: {
        currency,
        amount,
      },
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: newProduct,
    });
  } catch (error) {
    console.log("error in create api", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const createProductController = async (req, res) => {
  try {
    const { productName, currency, amount, category, description, imageUrl } =
      req.body;

    if (!productName || !currency || !amount || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newProduct = await ProductModel.create({
      productName,
      description,
      category,
      price: {
        currency,
        amount,
      },
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: newProduct,
    });
  } catch (error) {
    console.log("error in create api", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
    
};
