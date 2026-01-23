import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'sales'],
      default: 'sales',
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

// Índices explícitos para optimización
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ active: 1 });
userSchema.index({ role: 1 });

export default mongoose.model('User', userSchema);
