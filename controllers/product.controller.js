import Product from "../model/product.model.js";

// Import the Product model


// Controller function to store product data
// export const addProduct = async (req, res) => {
//   try {
//     // Extract the data from the request body
//     const {
//       name,
//       description,
//       color,
//       sizes,
//       price,
//       regularPrice,
//       discount,
//       quantity,
//       type,
//       category,
//       brand,
//       images
//     } = req.body;

//     // Create a new product instance
//     const product = new Product({
//       name,
//       description,
//       color,
//       sizes,
//       price,
//       regularPrice,
//       discount,
//       quantity,
//       type,
//       category,
//       brand,
//       images
//     });

//     // Save the product to the database
//     const savedProduct = await product.save();

//     // Return a success response
//     return res.status(201).json({
//       success: true,
//       message: 'Product created successfully',
//       product: savedProduct
//     });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     // Check if the error is a validation error
//     if (error.name === 'ValidationError') {
//       // Return a bad request response with the validation errors
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.errors
//       });
//     }
//     // Return a generic error response
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to create product',
//       error: error.message
//     });
//   }
// };


// Add a new product
// import Product from '../models/product';

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      discount,
      type,
      category,
      new: isNew,
      sale,
      images,
      ratings,
      reviews,
      variants
    } = req.body;

    // Calculate the sum of stocks in variants
    const quantity = variants.reduce((acc, variant) => acc + variant.size.stock, 0);

    const product = new Product({
      name,
      brand,
      description,
      price,
      discount,
      quantity,
      type,
      category,
      new: isNew,
      sale,
      images,
      ratings: [], // Initialize with empty array
      reviews: [], // Initialize with empty array
      variants: [] // Initialize with empty array
    });

    // Add ratings to the product
    ratings.forEach((rating) => {
      product.ratings.push({
        user: rating.user,
        rating: rating.rating
      });
    });

    // Add reviews to the product
    reviews.forEach((review) => {
      product.reviews.push({
        user: review.user,
        review: review.review
      });
    });

    // Add variants to the product
    variants.forEach((variant) => {
      product.variants.push({
        color: {
          color_name: variant.color.color_name,
          color_code: variant.color.color_code
        },
        id: variant.id,
        image_id: variant.image_id,
        size: {
          size: variant.size.size,
          stock: variant.size.stock
        },
        sku: variant.sku
      });
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};




// Controller function to get all products
export const getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Return the products in the response
    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.query;

    // Find the product by ID in the database
    const product = await Product.findById({ _id: productId });

    // If the product is not found, return a not found response
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Return the product in the response
    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      product
    });
  } catch (error) {
    console.error('Error retrieving product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    });
  }
};

// Controller function to update a product by ID
export const updateProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedProductData = req.body;

    // Find the product by ID and update its data
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      updatedProductData,
      { new: true }
    );

    // If the product is not found, return a not found response
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Return the updated product in the response
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Controller function to delete a product by ID
export const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete({ _id: productId });

    // If the product is not found, return a not found response
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Return a success response
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Controller function to search for products
//  export const searchProducts = async (req, res) => {
//     try {
//       const { keyword } = req.query;

//       // Search for products using the keyword
//       const products = await Product.find({
//         $or: [
//           { name: { $regex: keyword, $options: 'i' } },
//           { description: { $regex: keyword, $options: 'i' } }
//         ]
//       });

//       // Return the products in the response
//       return res.status(200).json({
//         success: true,
//         message: 'Products retrieved successfully',
//         products
//       });
//     } catch (error) {
//       console.error('Error searching products:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to search products',
//         error: error.message
//       });
//     }
//   };

// Controller function to get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Find products by category
    const products = await Product.find({ category });

    // If no products are found, return a not found response
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found in the specified category'
      });
    }

    // Return the products in the response
    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products
    });
  } catch (error) {
    console.error('Error retrieving products by category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products by category',
      error: error.message
    });
  }
};

// Controller function to get products by top ratings
export const getProductsByTopRatings = async (req, res) => {
  try {
    const { limit } = req.query;

    // Find products sorted by highest ratings and limit the results
    const products = await Product.find()
      .sort({ 'rating': -1 })
      .limit(parseInt(limit));

    // If no products are found, return a not found response
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found with top ratings'
      });
    }

    // Return the products in the response
    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products
    });
  } catch (error) {
    console.error('Error retrieving products by top ratings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products by top ratings',
      error: error.message
    });
  }
};


// Controller function to get products by most reviewed
export const getProductsByMostReviewed = async (req, res) => {
  try {
    // Find products sorted by highest review count
    const products = await Product.aggregate([
      { $project: { _id: 1, name: 1, reviewCount: { $size: '$reviews' } } },
      { $sort: { reviewCount: -1 } }
    ]);

    // If no products are found, return a not found response
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found with reviews'
      });
    }

    // Return the products in the response
    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products
    });
  } catch (error) {
    console.error('Error retrieving products by most reviewed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products by most reviewed',
      error: error.message
    });
  }
};


// Controller function to add a review to a product
export const addReviewToProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user, review } = req.body;

    // Find the product by ID
    const product = await Product.findById({ _id: productId });

    // If the product is not found, return a not found response
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create a new review object
    const newReview = {
      user,
      review
    };

    // Add the review to the product's reviews array
    product.reviews.push(newReview);

    // Save the updated product
    await product.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error adding review to product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add review to product',
      error: error.message
    });
  }
};

// Controller function to add a rating to a product
export const addRatingToProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user, rating } = req.body;

    // Find the product by ID
    const product = await Product.findById({ _id: productId });

    // If the product is not found, return a not found response
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create a new rating object
    const newRating = {
      user,
      rating
    };

    // Add the rating to the product's rating array
    product.rating.push(newRating);

    // Save the updated product
    await product.save();

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Rating added successfully',
      rating: newRating
    });
  } catch (error) {
    console.error('Error adding rating to product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add rating to product',
      error: error.message
    });
  }
};


export const getNewProducts = async (req, res) => {
  try {
    const { limit } = req.query;
    const query = Product.find({
      new: true,
      createdAt: { $lte: new Date() }
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10) || 10);

    const products = await query.exec();
    res.json({ status: 200, success: true, products: products });

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve new products' });
  }
};



export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    // Perform text search on all fields
    const products = await Product.find({ $text: { $search: query } });

    // Provide search suggestions based on partial matching
    const suggestions = await Product.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(5)
      .select('name');

    res.json({ products, suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search products' });
  }
};
// Controller function to update stock by color and size
// export const updateStockByColorAndSize = async (req, res) => {
//     try {
//       const { productId } = req.params;
//       const { colorId, sizeId, stock } = req.body;

//       // Find the product by ID
//       const product = await Product.findById(productId);

//       // If the product is not found, return a not found response
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: 'Product not found'
//         });
//       }

//       // Find the color by ID in the product's color array
//       const color = product.color.find((c) => c._id.toString() === colorId);

//       // If the color is not found, return a not found response
//       if (!color) {
//         return res.status(404).json({
//           success: false,
//           message: 'Color not found'
//         });
//       }

//       // Find the size by ID in the color's sizes array
//       const size = color.sizes.find((s) => s._id.toString() === sizeId);

//       // If the size is not found, return a not found response
//       if (!size) {
//         return res.status(404).json({
//           success: false,
//           message: 'Size not found'
//         });
//       }

//       // Update the stock of the size
//       size.stock = stock;

//       // Save the updated product
//       await product.save();

//       // Return success response
//       return res.status(200).json({
//         success: true,
//         message: 'Stock updated successfully',
//         product
//       });
//     } catch (error) {
//       console.error('Error updating stock:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to update stock',
//         error: error.message
//       });
//     }
//   };




export const addVariant = async (req, res) => {
  try {
    const productId = req.query.productId;
    const { variant } = req.body;
    console.log(variant)

    const product = await Product.findById({ _id: productId });


    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updatedVariants = [...product.variants, variant];
    product.variants = updatedVariants;



    // console.log("firstProductId:", product)



    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add variant', error: error });
  }
};