import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter agent name"],
  },
  email: {
    type: String,
    required: [true, "Please enter agent email"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
  mobile: {
    type: String,
    required: [true, "Please enter mobile number with country code"],
    match: [
      /^\+\d{1,3}\d{7,12}$/,
      "Mobile number must include country code (e.g., +911234567890)",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
  },
});

// Hash password before saving
agentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
agentSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Agent", agentSchema);
