import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  display_name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] 
  },
  hash_password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'vendor'] 
  },
  is_active: { type: Boolean, default: true }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

export default mongoose.model('User', userSchema);