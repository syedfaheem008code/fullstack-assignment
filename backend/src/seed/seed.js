import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { connectDB } from "../config/db.js";
import { User } from "../models/user.model.js";
import { Screen } from "../models/screen.model.js";
import { Playlist } from "../models/playlist.model.js";

async function run() {
  await connectDB();
  console.log("Seeding data...");

  await Promise.all([User.deleteMany({}), Screen.deleteMany({}), Playlist.deleteMany({})]);

  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name: "Admin", email, password: hashed, role: "ADMIN" });

  await Screen.insertMany([
    { name: "Lobby Display", isActive: true },
    { name: "Cafeteria TV", isActive: false },
    { name: "Conference Room Panel", isActive: true }
  ]);

  await Playlist.insertMany([
    { name: "Welcome Loop", itemUrls: ["https://example.com/welcome.mp4"] },
    { name: "Cafeteria Menu", itemUrls: ["https://example.com/menu1.png", "https://example.com/menu2.png"] }
  ]);

  console.log("Seeding complete.");
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
