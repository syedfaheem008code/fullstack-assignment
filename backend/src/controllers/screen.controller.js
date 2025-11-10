import { Screen } from "../models/screen.model.js";
import { parsePagination } from "../utils/pagination.js";

export async function listScreens(req, res) {
  const { search = "" } = req.query;
  const { limit, skip, page } = parsePagination(req.query);
  const q = search ? { name: { $regex: new RegExp(search, "i") } } : {};
  const [items, total] = await Promise.all([
    Screen.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Screen.countDocuments(q)
  ]);
  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function toggleScreen(req, res) {
  const { id } = req.params;
  const screen = await Screen.findById(id);
  if (!screen) return res.status(404).json({ error: "Screen not found" });
  screen.isActive = !screen.isActive;
  await screen.save();
  res.json({ _id: screen._id, name: screen.name, isActive: screen.isActive });
}
