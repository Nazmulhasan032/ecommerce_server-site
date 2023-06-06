import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  }
});

const ColorSchema = new mongoose.Schema({
  color_name: {
    type: String,
    required: true
  },
  color_code: {
    type: String,
    required: true
  },
});

const VariantSchema = new mongoose.Schema({
  color: { type: ColorSchema },
  id: { type: String },
  image_id: { type: Number },
  size: { type: SizeSchema },
  sku: { type: String }
});

const ImageSchema = new mongoose.Schema({
  image_id: { type: Number },
  id: { type: String },
  alt: { type: String },
  src: { type: String }
});

const CategoryEnum = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Books'];
const typeEnum = ["electronics", "furniture", "jewellery", "fashion", "beauty", "tools", "watch", "shoes", "bags", "kids", "eyeware", "light", "all"];

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  type: {
    type: String,
    required: false,
    enum: typeEnum,
    default: "fashion"
  },
  category: {
    type: String,
    enum: CategoryEnum,
    required: true
  },
  new: {
    type: Boolean,
    default: false,
    required: true
  },
  sale: {
    type: Boolean,
    required: true,
    default: false
  },
  images: [ImageSchema],
  ratings: [RatingSchema],
  rating: { type: Number, required: false, default: 0 },
  reviews: [ReviewSchema],
  availability: { type: String, required: false, default: "Available", enum: ["Available", "Out of stock"] },
  variants: [VariantSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate the sum of stocks in variants and update the quantity field
ProductSchema.pre('save', function (next) {
  const sumStock = this.variants.reduce((acc, variant) => acc + variant.size.stock, 0);
  this.quantity = sumStock;
  next();
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
