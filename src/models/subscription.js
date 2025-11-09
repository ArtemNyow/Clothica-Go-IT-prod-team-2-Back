import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
  },
  { timestamps: true }
);

export const Subscription = model("Subscription", subscriptionSchema);
