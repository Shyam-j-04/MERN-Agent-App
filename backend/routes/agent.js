import express from "express";
import { createAgent } from "../controllers/agentController.js";

const router = express.Router();

// POST /api/agents - create a new agent
router.post("/", createAgent);

export default router;
