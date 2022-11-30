// Text
import Schema from 'validate';

const postSchema = new Schema({
    status: {
        type: 'String',
        default: 'public',
        enum: ['public', 'private']
    },
    username: {
        type: 'String',
        required: true,
    },
    textcontent: {
        type: 'String',
        required: true
    },
    title: {
        type: 'String',
        required: true
    }
})

export { postSchema };






