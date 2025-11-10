import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    itemUrls: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length <= 10,
        message: "itemUrls must have at most 10 items"
      },
      default: []
    }
  },
  { timestamps: true }
);

playlistSchema.index({ name: "text" });
playlistSchema.index({ name: 1 });

playlistSchema.virtual("itemCount").get(function () {
  return this.itemUrls?.length || 0;
});

playlistSchema.set("toJSON", { virtuals: true });
playlistSchema.set("toObject", { virtuals: true });

export const Playlist = mongoose.model("Playlist", playlistSchema);
