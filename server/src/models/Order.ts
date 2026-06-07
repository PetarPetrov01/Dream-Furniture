import { Schema, Types, model } from "mongoose";

export interface IOrder {
  products: { product: Types.ObjectId; count: number }[];
  totalPrice: number;
  _ownerId: Types.ObjectId;
}

const orderSchema = new Schema<IOrder>(
  {
    products: {
      type: [{ product: { type: Schema.Types.ObjectId, ref: "Product" }, count: { type: Number } }],
      required: true,
    },
    totalPrice: { type: Number, required: true },
    _ownerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
