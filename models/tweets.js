// Text
import Schema from 'validate';

const tweetSchema = new Schema({
    status: {
        type: 'String',
        default: 'public',
        enum: ['public', 'private']
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
        type: 'String',
        required: true
    }
})

export { tweetSchema };






