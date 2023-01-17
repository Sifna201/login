const mongoose = require('mongoose')
const Schema = mongoose.Schema
const catagorySchema = new Schema({
    category: {
        type:String,
        category_id: Schema.Types.ObjectId,
        ref: 'booklibrary',
    }
})
module.exports = mongoose.model('bookscategories', catagorySchema)