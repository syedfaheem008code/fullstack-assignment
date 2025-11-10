import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import screenRoutes from "./routes/screen.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/screens", screenRoutes);
app.use("/playlists", playlistRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
