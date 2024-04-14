const mongoose = require('mongoose');
// const User = require('../models/UserModel');
// const Link = require('../models/LinkModel');
// const Node = require('../models/NodeModel');
// const Network = require('../models/NetworkModel');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

const disconnectDB = async () => {
  return mongoose.disconnect();
};

// async function deleteAllEntries() {
//   try {
//     await User.deleteMany({});
//     console.log('Users deleted successfully.');

//     await Network.deleteMany({});
//     console.log('Networks deleted successfully.');

//     await Node.deleteMany({});
//     console.log('Nodes deleted successfully.');

//     await Link.deleteMany({});
//     console.log('Links deleted successfully.');
//   } catch (error) {
//     console.error('Error deleting entries:', error);
//   } finally {
//     // Close the database connection
//     mongoose.connection.close();
//   }
// }

// deleteAllEntries();

module.exports = { connectDB, disconnectDB };
