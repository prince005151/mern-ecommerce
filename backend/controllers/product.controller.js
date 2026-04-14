import Product from "../models/product.model.js"
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";


//only admin can get all product
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
 

export const getFeaturedProducts = async (req, res) => {
  try {
    console.log("Getting featured products...");
    
    // Fetch directly from MongoDB without Redis and without lean()
    const featuredProducts = await Product.find({ isFeatured: true });
    console.log(`Found ${featuredProducts.length} featured products`);
    
    // Return plain array
    return res.json(featuredProducts);
  } catch (error) {
    console.error("Critical error in getFeaturedProducts:", error.message);
    console.error("Stack:", error.stack);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category } = req.body;
    if (!name || !price || !description || !image || !category) {
      return res.status(401).json({ message: "provide all details" })
    }
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, )
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ?? " ",
      category,
    })
    res.status(200).json({ product })
  } catch (error) {
    console.log("Error in creating product", error.message)
    res.status(500).json({ message: "server Error", error: error.message })

  }
}

export const deleteProduct = async (req, res) => {
  try {
    // Find product by ID
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary if it exists
    if (product.image) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.log("Error deleting image from Cloudinary:", error);
      }
    }

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Error deleting product" });
  }
};

export const getRecommendation = async (req, res) => {
    try {
       const product = await Product.aggregate([
            {$sample: {size: 3}},
            {$project: {
                _id:1,
                name:1,
                description:1,
                price:1
            }}
        ])
       res.json(product);
    } catch (error) {
        res.status(500).json({message: "error to show reccommendation"})
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const {category} = req.params;
        const categories = await Product.find({category})
        if(!categories){
          return res.json({message: "category not found"})
        }
      res.json(categories)
    } catch (error) {
        res.status(500).json({message: "error to fetch categories"})
    }
}

export const toggleFeatureproduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Toggle the isFeatured field
    product.isFeatured = !product.isFeatured;

    // Save updated product
    const updatedProduct = await product.save();

    // Update cache
    await updateFeaturedProductCache();

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error toggling featured product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("Error updating featured product cache:", error);
  }
}