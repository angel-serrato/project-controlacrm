import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      lowercase: true,
      trim: true,
      enum: ['admin', 'manager', 'employee', 'client'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [100, 'Description must not exceed 100 characters'],
    },
    permissions: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'roles',
  },
);

const Role = model('Role', roleSchema);
export default Role;
