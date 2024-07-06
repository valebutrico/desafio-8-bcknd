import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: function() { return !this.githubId; } },
  last_name: { type: String, required: function() { return !this.githubId; } },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: function() { return !this.githubId; } },
  password: { type: String, required: function() { return !this.githubId; } },
  githubId: { type: String },
  role: { type: String, default: 'user' },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
});

const User = mongoose.model('User', userSchema);

export default User;