import { Schema, model, Types } from "mongoose";

export interface IUser {
  email: string;
  username: string;
  wishlist: Types.ObjectId[];
  hashedPassword: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  wishlist: { type: [Types.ObjectId], ref: "Product", default: [] },
  hashedPassword: { type: String, required: true },
});

userSchema.index({ email: 1 }, { collation: { locale: "en", strength: 2 } });

const User = model<IUser>("User", userSchema);
export default User;
