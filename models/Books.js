const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        category_id: Schema.Types.ObjectId,
        category: Schema.Types.ObjectId, ref: 'categories',
    }
})

module.exports = mongoose.model('booksLibrary', bookSchema)