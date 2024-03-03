const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NetworkSchema = new Schema(
  {
    title: String,
    description: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
    links: [{ type: Schema.Types.ObjectId, ref: 'Link' }],
  },
  { timestamps: true }
);

const Network = mongoose.model('Network', NetworkSchema);
module.exports = Network;
