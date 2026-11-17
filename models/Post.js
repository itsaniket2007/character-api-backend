import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },        // character name
    description: { type: String, required: true },
    series: { type: String, default: "Unknown" },              // show / game / book
    imageUrl: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
