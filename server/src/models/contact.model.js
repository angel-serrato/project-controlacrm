import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED'],
      default: 'NEW',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices explícitos para optimización
contactSchema.index({ active: 1 });
contactSchema.index({ assignedTo: 1, active: 1 });
contactSchema.index({ status: 1, active: 1 });
contactSchema.index({ email: 1 });

export default mongoose.model('Contact', contactSchema);
