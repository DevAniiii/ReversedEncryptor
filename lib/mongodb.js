import mongoose from 'mongoose';

import 'dotenv/config';
const mongo = process.env.MONGODB_URI;

if (!mongoose.connection.readyState) {
  mongoose.connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default mongoose;
