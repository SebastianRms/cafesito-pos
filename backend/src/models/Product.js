import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images_url: [
      {
        type: String,
        default: "https://placehold.co/800x600.png",
      },
    ],
    category: {
      type: String,
      required: false,
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

export default mongoose.model("Product", productSchema);
