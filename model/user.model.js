import mongoose from "mongoose";

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    type: { type: String, enum: ["Billing", "Shipping"], required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    contactNo: {
      type: String,
      default: function () {
        return this.model("User").schema.paths.phone.default;
      },
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    PaymentType: {
      type: String,
      required: true,
      default: "COD",
      enum: ["COD", "Prepaid"],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserSchema = new Schema(
  {
    user_id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: {
      type: String,
      default: function () {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    bio: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    language: { type: String, enum: ["English", "Hinde"], required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    addresses: [AddressSchema],
    orders: [OrderSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
