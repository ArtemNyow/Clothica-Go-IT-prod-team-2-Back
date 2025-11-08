import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre('save', function (next) {
  if (!this.username) {
    this.username = this.email;
  }
  next();
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
