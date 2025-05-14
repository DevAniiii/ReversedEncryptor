import mongoose from 'mongoose';

const MONGODB_URI = 'momongodb+srv://Ani:rlTftBhtIRUtKe@cluster0.2sfbj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default mongoose;
