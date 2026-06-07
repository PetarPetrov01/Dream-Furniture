import { Schema, model, Types } from "mongoose";

export interface IUser {
  email: string;
  username: string;
  wishlist: Types.ObjectId[];
  hashedPassword: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  username: { type: String, required: true },
  wishlist: { type: [Types.ObjectId], ref: "Product", default: [] },
  hashedPassword: { type: String, required: true },
});

// Single index definition: unique + case-insensitive (matches the collation
// used by the login/register lookups). Replaces the field-level `unique: true`
// that previously collided with this declaration.
userSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const User = model<IUser>("User", userSchema);
export default User;
