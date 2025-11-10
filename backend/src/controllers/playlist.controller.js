import { validationResult } from "express-validator";
import { Playlist } from "../models/playlist.model.js";
import { parsePagination } from "../utils/pagination.js";

export async function listPlaylists(req, res) {
  const { search = "" } = req.query;
  const { limit, skip, page } = parsePagination(req.query);
  const q = search ? { name: { $regex: new RegExp(search, "i") } } : {};
  const [docs, total] = await Promise.all([
    Playlist.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Playlist.countDocuments(q)
  ]);
  const items = docs.map(d => ({ _id: d._id, name: d.name, itemCount: d.itemUrls.length }));
  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function createPlaylist(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, itemUrls = [] } = req.body;
  const playlist = await Playlist.create({ name, itemUrls });
  res.status(201).json({ _id: playlist._id, name: playlist.name, itemCount: playlist.itemUrls.length });
}
