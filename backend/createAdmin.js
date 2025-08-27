// createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // adjust path if needed
import readline from "readline";

dotenv.config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask user for input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
};

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Ask for valid email
    let email;
    while (true) {
      email = await askQuestion("Enter admin email: ");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) break;
      console.log("Invalid email format. Please try again.");
    }

    // Ask for password
    const password = await askQuestion("Enter admin password: ");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin already exists: ${email}`);
      rl.close();
      process.exit();
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new User({ email, password: hashedPassword });
    await admin.save();

    console.log("Admin user created successfully:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    rl.close();
    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    rl.close();
    process.exit(1);
  }
};

// Run the function
createAdmin();
