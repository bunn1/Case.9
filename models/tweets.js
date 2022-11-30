import Schema from 'validate';

const postSchema = new Schema({
    status: {
        type: 'String',
        default: 'public',
        enum: ['public', 'private']
    },
    username: {
        type: 'String',
        required: 'true'
    }
})

export { postSchema };






s