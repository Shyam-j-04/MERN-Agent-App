import Agent from "../models/Agent.js";
import bcrypt from "bcryptjs";

export const createAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Basic validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Mobile number with country code validation (e.g., +911234567890)
    const mobileRegex = /^\+\d{1,3}\d{7,12}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must include country code (e.g., +911234567890)",
      });
    }

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent already exists with this email",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create agent
    const agent = new Agent({
      name,
      email,
      mobile,
      password: hashedPassword,
    });
    await agent.save();

    return res.status(201).json({
      success: true,
      message: "Agent created successfully",
      data: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
      },
    });
  } catch (err) {
    console.error("Error creating agent:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
