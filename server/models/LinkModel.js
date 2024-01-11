const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinkSchema = new Schema(
  {
    network_id: { type: Schema.Types.ObjectId, ref: "Network" },
    source: { type: Schema.Types.ObjectId, ref: "Node" },
    target: { type: Schema.Types.ObjectId, ref: "Node" },
    data: Object,
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", LinkSchema);
module.exports = Link;
