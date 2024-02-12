const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NodeSchema = new Schema(
  {
    network_id: { type: Schema.Types.ObjectId, ref: 'Network' },
    label: String,
    data: Object,
    color: String,
  },
  { timestamps: true }
);

const Node = mongoose.model('Node', NodeSchema);
module.exports = Node;
