import mongoose from 'mongoose';
import Tweet from '../models/Tweet';

export const connectDatabase = async () => {
try {
await mongoose.connect('mongodb://localhost:27017/db2', { useNewUrlParser: true });
console.log('Database connection successful');
} catch (err) {
console.error('Database connection error', err);
}
};

export const getTweetById = async (id) => {
try {
const tweet = await Tweet.findById(id).lean();
return tweet;
} catch (err) {
console.error('Error getting tweet', err);
throw err;
}
};

export  default {getTweetById};