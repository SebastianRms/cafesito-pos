import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        product_name: String,
        quantity: { type: Number, required: true },
        unit_price: { type: Number, required: true },
        line_total: { type: Number, required: true },
      },
    ],
    subtotal: { 
        type: Number, 
        required: true 
    },
    discount_percent: { 
        type: Number, 
        default: 0 
    },
    discount_amount: { 
        type: Number, 
        default: 0 
    },
    total: { 
        type: Number, 
        required: true 
    },

    payment_method: {
      type: String,
      enum: ["cash", "card", "transfer"],
      default: "cash",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

// Configuración para que el JSON siempre cumpla el contrato
saleSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.sale_id = ret._id;
    ret.created_at = ret.created_at; 
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Método para generar el ticket sin ensuciar el controlador
saleSchema.methods.generateTicket = function() {
  return {
    saleId: this._id,
    timestamp: this.created_at,
    storeName: "Cafecito Feliz",
    items: this.items.map(i => ({
      name: i.product_name,
      qty: i.quantity,
      unitPrice: i.unit_price,
      lineTotal: i.line_total
    })),
    subtotal: this.subtotal,
    discount: `${this.discount_percent}% (-$${this.discount_amount})`,
    total: this.total,
    paymentMethod: this.payment_method
  };
};

export default mongoose.model("Sale", saleSchema);
