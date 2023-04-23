// Text
import Schema from 'validate';
import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
    status: {
        type: 'String',
        enum: ['public', 'private'],
        default: 'public',
       
    },
    userName: {
        type: 'String',
        required: true,
    },
    textContent: {
        type: 'String',
        required: true
    },
    title: {
        type: 'String',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    text: {  
        type: 'String',
},
});

export default mongoose.model  ('Tweet',  tweetSchema) ;






